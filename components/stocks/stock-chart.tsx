"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Cell
} from "recharts"
import type { ChartData } from "@/lib/api"

interface StockChartProps {
  data: ChartData[]
  symbol: string
}

// Proper Candlestick Component
const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  if (!payload) return null;
  
  const { open, close, high, low, yAxisDomain } = payload;
  const [yMin, yMax] = yAxisDomain || [low, high];
  const yRange = yMax - yMin;
  
  // Calculate positions based on the Y-axis scale
  const highY = y + ((yMax - high) / yRange) * height;
  const lowY = y + ((yMax - low) / yRange) * height;
  const openY = y + ((yMax - open) / yRange) * height;
  const closeY = y + ((yMax - close) / yRange) * height;
  
  const isPositive = close >= open;
  const color = isPositive ? "#22c55e" : "#ef4444";
  
  // Body dimensions
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(closeY - openY);
  const bodyWidth = width * 0.6;
  const bodyX = x + (width - bodyWidth) / 2;
  
  // Wick positions
  const wickX = x + width / 2;
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={bodyTop}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Lower wick */}
      <line
        x1={wickX}
        y1={bodyTop + bodyHeight}
        x2={wickX}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body rectangle */}
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(bodyHeight, 1)} // Minimum height for doji candles
        fill={isPositive ? color : color}
        stroke={color}
        strokeWidth={1}
        fillOpacity={isPositive ? 0.8 : 1}
      />
    </g>
  );
};

export function StockChart({ data, symbol }: StockChartProps) {
  // Calculate moving averages
  const calculateMA = (data: ChartData[], period: number) => {
    return data.map((item, index) => {
      if (index < period - 1) return null;
      const sum = data.slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr.close, 0);
      return sum / period;
    });
  };

  const ma20 = calculateMA(data, 20);
  const ma50 = calculateMA(data, 50);

  // Calculate Y-axis domain for candlestick chart
  const allPrices = data.flatMap(d => [d.open, d.close, d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const padding = (maxPrice - minPrice) * 0.05; // 5% padding
  const yAxisDomain = [minPrice - padding, maxPrice + padding];

  // Prepare data for different chart types
  const lineData = data.map((item, index) => ({
    timestamp: item.timestamp,
    price: item.close,
    volume: item.volume,
    ma20: ma20[index],
    ma50: ma50[index],
  }));

  const candlestickData = data.map((item) => ({
    timestamp: item.timestamp,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    volume: item.volume,
    yAxisDomain: yAxisDomain,
    // Dummy value for the bar chart - we'll use the high value
    value: item.high,
  }));

  const volumeData = data.map((item) => ({
    timestamp: item.timestamp,
    volume: item.volume,
    isPositive: item.close >= item.open,
  }));

  // Custom tooltip for candlestick
  const CandlestickTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-md p-2 shadow-lg">
          <p className="text-sm font-medium">{new Date(label).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">Open: ${data.open?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">High: ${data.high?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Low: ${data.low?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Close: ${data.close?.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Volume: {data.volume?.toLocaleString('de-DE')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{symbol} Trading Charts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="line" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="line">Line</TabsTrigger>
            <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
            <TabsTrigger value="area">Area</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          {/* Line Chart */}
          <TabsContent value="line" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tickFormatter={(value) => `$${value.toFixed(2)}`} 
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Candlestick Chart */}
          <TabsContent value="candlestick" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={candlestickData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                    domain={yAxisDomain}
                  />
                  <Tooltip content={<CandlestickTooltip />} />
                  <Bar 
                    dataKey="value" 
                    shape={<CandlestickBar />}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Area Chart */}
          <TabsContent value="area" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tickFormatter={(value) => `$${value.toFixed(2)}`} 
                  />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Volume Chart */}
          <TabsContent value="volume" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} 
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString('de-DE'), "Volume"]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar 
                    dataKey="volume"
                  >
                    {volumeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPositive ? "#22c55e" : "#ef4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Technical Analysis Chart with Moving Averages */}
          <TabsContent value="technical" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    className="text-xs fill-muted-foreground"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground" 
                    tickFormatter={(value) => `$${value.toFixed(2)}`} 
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const labels = {
                        price: "Price",
                        ma20: "MA 20",
                        ma50: "MA 50"
                      };
                      return [`$${value?.toFixed(2) || 'N/A'}`, labels[name as keyof typeof labels] || name];
                    }}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                    dot={false}
                    name="price"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ma20" 
                    stroke="#f59e0b" 
                    strokeWidth={1.5} 
                    dot={false}
                    strokeDasharray="5 5"
                    name="ma20"
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ma50" 
                    stroke="#8b5cf6" 
                    strokeWidth={1.5} 
                    dot={false}
                    strokeDasharray="10 5"
                    name="ma50"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-primary"></div>
                <span>Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500" style={{backgroundImage: 'repeating-linear-gradient(to right, #f59e0b, #f59e0b 3px, transparent 3px, transparent 6px)'}}></div>
                <span>MA 20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-violet-500" style={{backgroundImage: 'repeating-linear-gradient(to right, #8b5cf6, #8b5cf6 5px, transparent 5px, transparent 8px)'}}></div>
                <span>MA 50</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}