'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', steps: 4000 },
  { name: 'Feb', steps: 3000 },
  { name: 'Mar', steps: 2000 },
  { name: 'Apr', steps: 2780 },
  { name: 'May', steps: 1890 },
  { name: 'Jun', steps: 2390 },
  { name: 'Jul', steps: 3490 },
  { name: 'Aug', steps: 4000 },
  { name: 'Sep', steps: 3000 },
  { name: 'Oct', steps: 2000 },
  { name: 'Nov', steps: 2780 },
  { name: 'Dec', steps: 3890 },
];

const OverviewChart = () => {
  return (
    <div className="col-span-2 h-full min-h-[300px] w-full rounded-3xl bg-[#5B4DBC] p-6 text-white shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Overview</h3>
        </div>
        <select className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-md outline-none hover:bg-white/20">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      <div className="relative h-[200px] w-full">
        {/* Main large number overlay */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-xs text-white/70">Total Steps</span>
            <span className="text-2xl font-bold">9.178 Steps</span>
          </div>
          {/* Small indicator dot on the chart line would be complex, skipping for now */}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F472B6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F472B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
              dy={10}
            />
            {/* <YAxis hide /> */}
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', color: '#333' }}
              itemStyle={{ color: '#E85C9E' }}
            />
            <Area
              type="monotone"
              dataKey="steps"
              stroke="#F472B6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorSteps)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs opacity-60">Total Time</span>
          <span className="text-xl font-bold">748 Hr</span>
          <span className="text-xs opacity-60">April</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-60">Total Steps</span>
          <span className="text-xl font-bold">9.178 St</span>
          <span className="text-xs opacity-60">April</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs opacity-60">Target</span>
          <span className="text-xl font-bold">9.200 St</span>
          <span className="text-xs opacity-60">April</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewChart;
