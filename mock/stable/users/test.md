+++
[headers]
access-control-allow-origin = "http://localhost:9876"
access-control-allow-headers = "Authorization"
access-control-allow-methods = "GET, PATCH"
+++

```json
[
  {
    "uid": "test",
    "created": 1516380671346,
    "Extensions": [
      {
        "key": "price_per_hour",
        "value": {
          "usd": "10.00",
          "jpy": "1000"
        }
      },
      {
        "key": "name",
        "value": "test"
      },
      {
        "key": "picture",
        "value": "https://example.com/img.jpg"
      },
      {
        "key": "skill",
        "value": "test\ntest\ntest"
      }
    ]
  }
]
```
