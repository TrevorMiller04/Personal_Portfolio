'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Database, BarChart3 } from 'lucide-react'

// Dynamic import to avoid SSR issues with Plotly
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center">Loading chart...</div>
})

interface AnalysisResult {
  salesByCategory: Array<{ category: string; total_sales: number }>
  monthlyTrend: Array<{ month: string; total_sales: number; order_count: number }>
}

export default function DataStoriesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const runAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Import DuckDB dynamically to avoid SSR issues
      const duckdb = await import('@duckdb/duckdb-wasm')
      
      // Initialize DuckDB
      const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles()
      const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES)
      const worker_url = URL.createObjectURL(
        new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
      )
      const worker = new Worker(worker_url)
      const logger = new duckdb.ConsoleLogger()
      const db = new duckdb.AsyncDuckDB(logger, worker)
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
      
      // Load CSV data
      const response = await fetch('/data/sample_orders.csv')
      const csvText = await response.text()
      
      // Register CSV as a table
      await db.registerFileText('orders.csv', csvText)
      
      // Create connection
      const conn = await db.connect()
      
      // Query 1: Sales by Category
      const categoryQuery = `
        SELECT 
          category,
          ROUND(SUM(total_amount), 2) as total_sales
        FROM read_csv_auto('orders.csv')
        GROUP BY category
        ORDER BY total_sales DESC
      `
      
      const categoryResult = await conn.query(categoryQuery)
      const salesByCategory = categoryResult.toArray().map(row => ({
        category: row.category,
        total_sales: row.total_sales
      }))
      
      // Query 2: Monthly Trend
      const monthlyQuery = `
        SELECT 
          strftime(CAST(order_date AS DATE), '%Y-%m') as month,
          ROUND(SUM(total_amount), 2) as total_sales,
          COUNT(*) as order_count
        FROM read_csv_auto('orders.csv')
        GROUP BY strftime(CAST(order_date AS DATE), '%Y-%m')
        ORDER BY month
      `
      
      const monthlyResult = await conn.query(monthlyQuery)
      const monthlyTrend = monthlyResult.toArray().map(row => ({
        month: row.month,
        total_sales: row.total_sales,
        order_count: row.order_count
      }))
      
      setResults({
        salesByCategory,
        monthlyTrend
      })
      
      // Cleanup
      await conn.close()
      await db.terminate()
      worker.terminate()
      URL.revokeObjectURL(worker_url)
      
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Data Stories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Interactive data analysis using DuckDB-WASM for in-browser SQL queries and Plotly for dynamic visualizations. 
            Demonstrating modern data engineering capabilities in the browser.
          </p>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                E-commerce Sales Analysis
              </CardTitle>
              <CardDescription>
                Analyzing 30 sample orders across multiple categories and regions using SQL in the browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runAnalysis} 
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <p className="text-muted-foreground">
                Data processed entirely in your browser using DuckDB-WASM
              </p>
            </div>

            {/* Sales by Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Total revenue breakdown by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Plot
                  data={[
                    {
                      x: results.salesByCategory.map(d => d.category),
                      y: results.salesByCategory.map(d => d.total_sales),
                      type: 'bar',
                      marker: { color: '#0077B6' },
                      name: 'Sales',
                    },
                  ]}
                  layout={{
                    title: '',
                    xaxis: { title: 'Category' },
                    yaxis: { title: 'Total Sales ($)' },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    font: { family: 'Inter, sans-serif' },
                  }}
                  config={{ displayModeBar: false }}
                  className="w-full"
                  style={{ height: '400px' }}
                />
              </CardContent>
            </Card>

            {/* Monthly Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>
                  Sales volume and order count over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Plot
                  data={[
                    {
                      x: results.monthlyTrend.map(d => d.month),
                      y: results.monthlyTrend.map(d => d.total_sales),
                      type: 'scatter',
                      mode: 'lines+markers',
                      name: 'Sales ($)',
                      yaxis: 'y',
                      marker: { color: '#0077B6' },
                      line: { width: 3 },
                    },
                    {
                      x: results.monthlyTrend.map(d => d.month),
                      y: results.monthlyTrend.map(d => d.order_count),
                      type: 'scatter',
                      mode: 'lines+markers',
                      name: 'Orders',
                      yaxis: 'y2',
                      marker: { color: '#C13F03' },
                      line: { width: 3 },
                    },
                  ]}
                  layout={{
                    title: '',
                    xaxis: { title: 'Month' },
                    yaxis: { title: 'Sales ($)', side: 'left' },
                    yaxis2: {
                      title: 'Number of Orders',
                      side: 'right',
                      overlaying: 'y',
                    },
                    plot_bgcolor: 'transparent',
                    paper_bgcolor: 'transparent',
                    font: { family: 'Inter, sans-serif' },
                    legend: { x: 0, y: 1 },
                  }}
                  config={{ displayModeBar: false }}
                  className="w-full"
                  style={{ height: '400px' }}
                />
              </CardContent>
            </Card>

            {/* What This Shows */}
            <Card>
              <CardHeader>
                <CardTitle>What This Demonstrates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">🔧 Technical Skills</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• DuckDB-WASM for browser-based SQL</li>
                      <li>• Plotly.js for interactive visualizations</li>
                      <li>• Next.js dynamic imports</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Responsive data presentation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📊 Data Engineering</h4>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• In-browser data processing</li>
                      <li>• SQL aggregation and grouping</li>
                      <li>• Date-based time series analysis</li>
                      <li>• Multi-dimensional data visualization</li>
                      <li>• Real-time computation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}