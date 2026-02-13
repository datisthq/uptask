---
title: Working with Tabular Data in Python
sidebar:
  label: Tabular Data
  order: 11
---

High-performance data processing and schema validation for tabular data built on **Polars** (a Rust-based DataFrame library).

## Installation

```bash
pip install fairspec
```

## Getting Started

The table package provides core utilities for working with tabular data:

- `normalize_table` - Convert table data to match a schema
- `denormalize_table` - Convert normalized data back to raw format
- `infer_table_schema_from_table` - Automatically infer schema from table data
- `inspect_table` - Get table structure information
- `query_table` - Query tables using SQL-like syntax

For example:

```python
from fairspec import load_csv_table, infer_table_schema_from_table, Resource

table = load_csv_table(Resource(data="data.csv"))
schema = infer_table_schema_from_table(table)
```

## Basic Usage

### Schema Inference

Automatically infer Table Schema from data:

```python
import polars as pl
from fairspec import infer_table_schema_from_table

table = pl.DataFrame({
    "id": ["1", "2", "3"],
    "price": ["10.50", "25.00", "15.75"],
    "date": ["2023-01-15", "2023-02-20", "2023-03-25"],
    "active": ["true", "false", "true"],
}).lazy()

schema = infer_table_schema_from_table(table, sample_rows=100, confidence=0.9)

# Result: automatically detected integer, number, date, and boolean types
```

### Table Normalization

Convert table data to match a Table Schema (type conversion):

```python
import polars as pl
from fairspec import normalize_table
from fairspec_metadata import TableSchema, IntegerColumnProperty, NumberColumnProperty, BooleanColumnProperty, DateColumnProperty

table = pl.DataFrame({
    "id": ["1", "2", "3"],
    "price": ["10.50", "25.00", "15.75"],
    "active": ["true", "false", "true"],
    "date": ["2023-01-15", "2023-02-20", "2023-03-25"],
}).lazy()

schema = TableSchema(properties={
    "id": IntegerColumnProperty(),
    "price": NumberColumnProperty(),
    "active": BooleanColumnProperty(),
    "date": DateColumnProperty(),
})

normalized = normalize_table(table, schema)
result = normalized.collect()

# Result has properly typed columns:
# { id: 1, price: 10.50, active: True, date: Date("2023-01-15") }
```

### Table Denormalization

Convert normalized data back to raw format (for saving):

```python
from fairspec import denormalize_table

denormalized = denormalize_table(table, schema, native_types=["string", "number", "boolean"])
```

## Advanced Features

### Working with Table Schema

Define schemas with column properties and constraints:

```python
from fairspec_metadata import TableSchema, IntegerColumnProperty, StringColumnProperty

schema = TableSchema(
    properties={
        "id": IntegerColumnProperty(minimum=1),
        "name": StringColumnProperty(minLength=1, maxLength=100),
        "email": StringColumnProperty(pattern=r"^[^@]+@[^@]+\.[^@]+$"),
        "age": IntegerColumnProperty(minimum=0, maximum=150),
        "status": StringColumnProperty(enum=["active", "inactive", "pending"]),
    },
    required=["id", "name", "email"],
    primaryKey=["id"],
)
```

### Schema Inference Options

Customize how schemas are inferred:

```python
from fairspec import infer_table_schema_from_table

schema = infer_table_schema_from_table(
    table,
    sample_rows=100,
    confidence=0.9,
    keep_strings=False,
    column_types={"id": "integer", "status": "categorical"},
)
```

### Handling Missing Values

Define missing value indicators:

```python
from fairspec_metadata import TableSchema, NumberColumnProperty

schema = TableSchema(
    properties={"value": NumberColumnProperty()},
    missingValues=["", "N/A", "null", -999],
)
```

### Primary Keys and Constraints

Define table-level constraints:

```python
from fairspec_metadata import TableSchema, IntegerColumnProperty, StringColumnProperty, UniqueKey

schema = TableSchema(
    properties={
        "user_id": IntegerColumnProperty(),
        "email": StringColumnProperty(),
    },
    primaryKey=["user_id"],
    uniqueKeys=[UniqueKey(columnNames=["email"])],
)
```

## Supported Column Types

### Primitive Types
- `string` - Text data
- `integer` - Whole numbers
- `number` - Decimal numbers
- `boolean` - True/false values

### Temporal Types
- `date` - Calendar dates
- `datetime` - Date and time
- `time` - Time of day
- `duration` - Time spans

### Spatial Types
- `geojson` - GeoJSON geometries
- `wkt` - Well-Known Text geometries
- `wkb` - Well-Known Binary geometries

### Complex Types
- `array` - Fixed-length arrays
- `list` - Variable-length lists
- `object` - JSON objects

### Specialized Types
- `email` - Email addresses
- `url` - URLs
- `categorical` - Categorical data
- `base64` - Base64 encoded data
- `hex` - Hexadecimal data

## Table Type

The package uses `LazyFrame` from Polars for efficient processing:

```python
import polars as pl
from fairspec_table import Table

# Table is an alias for pl.LazyFrame
table: Table = pl.DataFrame({"id": [1, 2, 3]}).lazy()
```
