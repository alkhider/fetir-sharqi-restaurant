#!/usr/bin/env python3
"""
Invoice Data Extractor for Fetir Sharqi Restaurant
Parses Excel invoice files and inserts data into SQLite database.

Usage:
    python extract_invoices.py <excel_file> [--db <database_path>]

Example:
    python extract_invoices.py /path/to/6-26.xlsx --db ./fetir_sharqi.db
"""

import pandas as pd
import sqlite3
import re
import os
import argparse
from datetime import datetime


def parse_invoices(filepath):
    """Parse an Excel invoice file and return invoices and items"""
    df = pd.read_excel(filepath, header=None)
    data = df.fillna('').values

    # Find invoice start positions
    invoice_starts = []
    for i in range(len(data)):
        row = data[i]
        non_empty = [str(v).strip() for v in row if str(v).strip() not in ['', 'nan']]
        if len(non_empty) >= 2 and 'رقم الفاتوره' in str(non_empty[1]):
            try:
                float(non_empty[0])
                invoice_starts.append(i)
            except:
                pass

    invoices = []

    for idx, start_idx in enumerate(invoice_starts):
        end_idx = invoice_starts[idx + 1] if idx + 1 < len(invoice_starts) else len(data)
        invoice_block = data[start_idx:end_idx]

        inv = {
            'order_type': None,
            'payment_type': None,
            'customer_name': None,
            'customer_phone': None,
            'customer_type': 'direct',
            'date': None,
            'time': None,
            'subtotal': 0,
            'vat_amount': 0,
            'discount': 0,
            'service_charge': 0,
            'delivery_fee': 0,
            'total_amount': 0,
            'items': []
        }

        parsing_items = False

        for row_idx, row in enumerate(invoice_block):
            non_empty = [(str(v).strip(), v) for v in row if str(v).strip() not in ['', 'nan']]
            if len(non_empty) == 0:
                continue

            str_vals = [v[0] for v in non_empty]
            raw_vals = [v[1] for v in non_empty]
            row_str = ' '.join(str_vals)

            # Skip page/header rows
            if 'تقرير تفاصيل' in row_str or 'Page ' in row_str:
                continue
            if 'يشمل الاجمالي' in row_str:
                continue
            if 'الرقم التسلسلي' in row_str:
                continue

            # Invoice number
            if 'رقم الفاتوره' in row_str:
                continue

            # Order/Payment type
            if inv['order_type'] is None and len(str_vals) == 2:
                first, second = str_vals[0], str_vals[1]
                order_types = ['سفري', 'محلي', 'كيتا', 'هنجر ستيشن', 'طلب واتصال']
                payment_types = ['شبكة', 'نقدي', 'آجل']

                if any(ot in first for ot in order_types) and any(pt in second for pt in payment_types):
                    if 'سفري' in first:
                        inv['order_type'] = 'takeaway'
                    elif 'محلي' in first:
                        inv['order_type'] = 'dine_in'
                    elif 'كيتا' in first:
                        inv['order_type'] = 'keta'
                        inv['customer_type'] = 'keta'
                    elif 'هنجر' in first:
                        inv['order_type'] = 'hungerstation'
                        inv['customer_type'] = 'hungerstation'
                    elif 'طلب واتصال' in first or 'واتصال' in first:
                        inv['order_type'] = 'phone_order'

                    if 'شبكة' in second:
                        inv['payment_type'] = 'card'
                    elif 'نقدي' in second:
                        inv['payment_type'] = 'cash'
                    elif 'آجل' in second:
                        inv['payment_type'] = 'deferred'
                    continue

            # Customer/Restaurant/Date row
            if 'مطعم فطير شرقي' in row_str:
                for v in str_vals:
                    v_str = str(v)
                    date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}\s+[AP]M)', v_str)
                    if date_match:
                        dt_str = date_match.group(1)
                        try:
                            dt = datetime.strptime(dt_str, '%m/%d/%Y %I:%M %p')
                        except:
                            dt = datetime.strptime(dt_str, '%d/%m/%Y %I:%M %p')
                        inv['date'] = dt.strftime('%Y-%m-%d')
                        inv['time'] = dt.strftime('%H:%M:%S')
                        inv['datetime'] = dt

                for v in str_vals:
                    v_str = str(v).strip()
                    if v_str in ['مطعم فطير شرقي للوجبات السريعة', 'Admin Admin', 'الكاشير', 'التاريخ']:
                        continue
                    if re.search(r'\d{1,2}/\d{1,2}/\d{4}', v_str):
                        continue
                    if v_str:
                        inv['customer_name'] = v_str
                        break
                continue

            # Summary row
            if 'ضريبة القيمة المضافه' in str_vals and 'قيمه' in str_vals:
                try:
                    for i, v in enumerate(str_vals):
                        if 'ضريبة' in v and i > 0:
                            inv['vat_amount'] = float(str_vals[i-1])
                        elif 'قيمة التوصيل' in v and i > 0:
                            inv['delivery_fee'] = float(str_vals[i-1])
                        elif 'الخدمات' in v and i > 0:
                            inv['service_charge'] = float(str_vals[i-1])
                        elif 'الخصم' in v and i > 0:
                            inv['discount'] = float(str_vals[i-1])
                        elif v == 'القيمه' and i > 0:
                            inv['subtotal'] = float(str_vals[i-1])
                except:
                    pass
                continue

            # Items header
            if 'الاجمالي الكلي' in str_vals and 'الوجبة' in str_vals:
                parsing_items = True
                continue

            # Invoice total row
            if 'اجمالي الفاتوره' in str_vals:
                parsing_items = False
                try:
                    for v in str_vals:
                        try:
                            total = float(v)
                            if total > 0:
                                inv['total_amount'] = round(total, 2)
                                break
                        except:
                            pass

                    if len(str_vals) >= 4 and 'العميل' in str_vals[-1]:
                        cust_name = str_vals[-2].strip()
                        if inv['customer_name'] is None:
                            inv['customer_name'] = cust_name
                        if 'كيتا' in cust_name or 'ك-1' in cust_name:
                            inv['customer_type'] = 'keta'
                        elif 'هنجر' in cust_name or 'هنقر' in cust_name:
                            inv['customer_type'] = 'hungerstation'
                except:
                    pass
                continue

            # Item row
            if parsing_items and len(str_vals) >= 4:
                try:
                    name = str_vals[-1].strip()
                    if name.replace('.', '').replace('-', '').isdigit():
                        continue
                    if 'اجمالي' in name or 'الفاتوره' in name:
                        continue

                    numeric_vals = []
                    for v in raw_vals[:-1]:
                        try:
                            numeric_vals.append(float(v))
                        except:
                            pass

                    if len(numeric_vals) >= 2:
                        qty = numeric_vals[-1]
                        unit_price = numeric_vals[-2]

                        if len(numeric_vals) >= 3:
                            total_price = numeric_vals[-3]
                        else:
                            total_price = qty * unit_price

                        if len(numeric_vals) >= 6:
                            tax_amount = numeric_vals[1]
                            item_discount = numeric_vals[2]
                        else:
                            tax_amount = 0
                            item_discount = 0

                        if qty > 0 and name and len(name) > 1:
                            inv['items'].append({
                                'item_name': name,
                                'quantity': qty,
                                'unit_price': round(unit_price, 2),
                                'total_price': round(total_price, 2),
                                'discount': round(item_discount, 2),
                                'tax_amount': round(tax_amount, 2)
                            })
                except:
                    pass

        invoices.append(inv)

    return invoices


def categorize_item(name):
    """Categorize menu items"""
    if any(kw in name for kw in ['بيبسي', 'ماء', 'شاي', 'مشروب غازي', 'كينزا']):
        return 'مشروبات'
    if 'حواوشي' in name:
        return 'حواوشي'
    if 'بيتزا' in name:
        return 'بيتزا'
    if 'كريب' in name:
        return 'كريب'
    if 'مشلتت' in name:
        return 'فطير مشلتت'
    sweet_keywords = ['نوتيلا', 'لوتس', 'قشطة', 'كاستر', 'بستاشيو', 'كابتشينو', 'بسبوسة', 'مارشميلو', 'عسل']
    if any(kw in name for kw in sweet_keywords):
        return 'فطير حلو'
    addon_keywords = ['جبن', 'جبنة', 'موزاريلا', 'رانش', 'سوسيس', 'باربيكيو', 'مخلل', 'مش', 'طحينة', 'هالبينو', 'برطمان']
    if any(kw in name for kw in addon_keywords) and 'فطيرة' not in name and 'كريب' not in name and 'بيتزا' not in name and 'حواوشي' not in name:
        return 'إضافات'
    if 'فطيرة' in name or 'فطير' in name:
        return 'فطير حادق'
    if 'مشوية' in name:
        return 'مشوية'
    return 'إضافات'


def insert_to_db(invoices, db_path):
    """Insert parsed invoices into SQLite database"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('SELECT MAX(invoice_id) FROM invoices')
    result = cursor.fetchone()
    max_id = result[0] if result[0] else 0

    inserted_invoices = 0
    inserted_items = 0

    for inv in invoices:
        max_id += 1

        customer_name = inv['customer_name'] or 'Unknown'
        customer_phone = None
        if '-' in customer_name:
            parts = customer_name.rsplit('-', 1)
            if len(parts) == 2 and parts[1].replace('0', '').isdigit():
                customer_phone = parts[1]
                customer_name = parts[0]

        dt = inv.get('datetime')
        if dt:
            month = dt.month
            year = dt.year
            day_of_week = dt.weekday()
            hour = dt.hour
        else:
            month = year = day_of_week = hour = None

        cursor.execute('''
            INSERT INTO invoices (invoice_id, date, time, datetime, order_type, payment_type,
                customer_name, customer_phone, customer_type, subtotal, vat_amount, discount,
                service_charge, delivery_fee, total_amount, month, year, day_of_week, hour)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            max_id, inv['date'], inv['time'],
            inv['date'] + ' ' + inv['time'] if inv['date'] and inv['time'] else None,
            inv['order_type'], inv['payment_type'], customer_name, customer_phone,
            inv['customer_type'], inv['subtotal'], inv['vat_amount'], inv['discount'],
            inv['service_charge'], inv['delivery_fee'], inv['total_amount'],
            month, year, day_of_week, hour
        ))
        inserted_invoices += 1

        for item in inv['items']:
            cat = categorize_item(item['item_name'])
            cursor.execute('''
                INSERT INTO invoice_items (invoice_id, item_name, category, quantity, unit_price, total_price, tax_amount, discount)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                max_id, item['item_name'], cat, item['quantity'],
                item['unit_price'], item['total_price'], item['tax_amount'], item['discount']
            ))
            inserted_items += 1

    conn.commit()
    conn.close()

    return inserted_invoices, inserted_items


def main():
    parser = argparse.ArgumentParser(description='Parse invoice Excel files and insert into database')
    parser.add_argument('file', help='Path to Excel invoice file')
    parser.add_argument('--db', default='fetir_sharqi.db', help='Path to SQLite database')
    args = parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File not found: {args.file}")
        return

    if not os.path.exists(args.db):
        print(f"Error: Database not found: {args.db}")
        print("Please create the database first or specify an existing one.")
        return

    print(f"Parsing {args.file}...")
    invoices = parse_invoices(args.file)
    print(f"Found {len(invoices)} invoices with {sum(len(i['items']) for i in invoices)} items")

    print(f"Inserting into {args.db}...")
    n_inv, n_it = insert_to_db(invoices, args.db)
    print(f"Inserted {n_inv} invoices and {n_it} items successfully!")


if __name__ == '__main__':
    main()
