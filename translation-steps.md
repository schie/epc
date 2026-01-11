## UPC → GTIN → SGTIN → EPC (SGTIN-96) Conversion Steps

### 1. Separate Your UPC Into Its Component Parts

Identify the three parts of your UPC-A (GTIN-12):

- **UPC Company Prefix**
- **Item Reference Number**
- **Check Digit** (last digit)

> The UPC Company Prefix can be found on your GS1 Company Prefix Certificate or via GEPIR.

---

### 2. Transform Your UPC Company Prefix Into a GS1 Company Prefix

- Add a leading **`0`** to your UPC Company Prefix.
- This converts it into a **GS1 Company Prefix**.

> GS1 Company Prefixes can be up to 11 digits long.

---

### 3. Translate to a 14-Digit GTIN

- Add an **Indicator Digit** (or filler `0`) to the front so the GTIN is **14 digits total**.
- GTINs shorter than 14 digits must be left-padded with zeros.

> If you already have a 14-digit GTIN, you can start here.

---

### 4. Drop the Check Digit

- Remove the **Check Digit**.
- EPC encoding uses other validation methods, so the check digit is no longer needed.

---

### 5. Move Your Indicator Digit

- Move the **Indicator Digit** so it becomes the **first digit of the Item Reference Number**.
- This improves RFID reader performance.

---

### 6. Add a Unique Serial Number

- Append a **Serial Number**:
  - Numeric only
  - 1–12 digits
  - Must not start with `0`
  - Must be ≤ `274,877,906,943`

> Serial numbers are brand-owner defined. Keep them simple.

At this point, you now have an **SGTIN**:

```
GS1 Company Prefix + (Indicator Digit + Item Reference Number) + Serial Number
```

---

### 7. Determine Your Header Value

- For **SGTIN-96**, the header value is:
  - **Decimal:** `48`
  - **Hex:** `30`

> If you already have an SGTIN, you can start here.

---

### 8. Determine Your Filter Value

Choose the filter value based on the tag’s use case:

| Use Case                 | Filter Value |
| ------------------------ | ------------ |
| Point-of-Sale (POS) item | `1`          |
| Full case for transport  | `2`          |
| Inner pack               | `4`          |
| Unit load                | `6`          |
| Other / reserved         | `0, 3, 5, 7` |

> Most UPC-based items use **Filter Value `1`**.

---

### 9. Determine Your Partition Value

- Count the number of digits in your **GS1 Company Prefix**.
- Use the SGTIN Partition Table to find the matching **Partition Value**.
- Insert it after the Filter Value.

> The leading zero added earlier **counts as a digit**.

---

### 10. Convert Decimal Values to Binary

Convert each EPC component into binary:

- Header (8 bits)
- Filter (3 bits)
- Partition (3 bits)
- GS1 Company Prefix
- Indicator Digit + Item Reference Number
- Serial Number

> RFID readers only read binary. This step is typically handled by software.

---

### 11. Create the Final EPC String

- Combine all binary fields into a single binary string.
- Optionally convert it into **hexadecimal** for readability.

Example output:

```
Binary: 00110000 001 101 ...
Hex:    3034257BF400B78000007AE3
```
