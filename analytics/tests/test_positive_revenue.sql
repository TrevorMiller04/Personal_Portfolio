-- Test: All monthly revenue should be positive
-- This test ensures data quality in our fact table

SELECT 
    order_month_start,
    total_revenue
FROM {{ ref('fct_sales_by_month') }}
WHERE total_revenue <= 0