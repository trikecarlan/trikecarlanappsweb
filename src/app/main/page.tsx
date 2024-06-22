"use client"

import Layout from "@/components/Layout";
import { BsThreeDots } from "react-icons/bs";
import { IoCloudDoneSharp } from "react-icons/io5";
import { MdPendingActions } from "react-icons/md";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Reports = () => {
    const data = {
        labels: ['ONE', 'TWO', 'THREE'],
        datasets: [
            {
                label: '# of Votes',
                data: [7, 13, 20],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: '#0000',
                formatter: (value: any, context: any) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    return `${label} ${value}%`;
                },
                align: 'end',
                anchor: 'end',
                clamp: true,
                offset: 20,
                textAlign: 'center',
                display: true,
            },
        },
    };

    const SSdata = [
        { label: 'Red', value: 25, color: 'bg-red-500' },
        { label: 'Blue', value: 25, color: 'bg-blue-500' },
        { label: 'Green', value: 25, color: 'bg-green-500' },
        { label: 'Yellow', value: 25, color: 'bg-yellow-500' },
    ];

    return (
        <Layout title="Dahboard">
            <div className="m-4">
                <section className="flex gap-2 items-center">
                    <label htmlFor="incidentyear">Incidents for this year:</label>
                    <select className="bg-gray-300 px-2 py-1 rounded-lg" name="incidentyear" id="incidentyear">
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                    </select>
                </section>
                <div className="flex py-8 lg:px-20 justify-between">
                    <span className="flex gap-2 px-14 py-2 rounded-lg w-max items-center bg-[#FFE071]">
                        <div className="rounded-full  bg-gray-900 p-1">
                            <BsThreeDots className="text-white" />
                        </div>
                        <div className="grid">
                            <p>4</p>
                            <p>Pending</p>
                        </div>
                    </span>
                    <span className="flex gap-2 px-14 py-2 rounded-lg w-max items-center bg-[#72A8F9]">
                        <div className="rounded-full p-1">
                            <MdPendingActions size={30} />
                        </div>
                        <div className="grid">
                            <p>4</p>
                            <p>Processing</p>
                        </div>
                    </span>
                    <span className="flex gap-2 px-14 py-2 rounded-lg w-max items-center bg-[#98EF0E]">
                        <div className="rounded-full p-1">
                            <IoCloudDoneSharp size={30} />
                        </div>
                        <div className="grid">
                            <p>4</p>
                            <p>Resolved</p>
                        </div>
                    </span>
                </div>
                {/* <div className="h-44 w-44 p-10">
                    <Doughnut data={data} options={options} />
                </div> */}

                <div className="h-44 w-44 p-10">
                    <div className="relative flex items-center justify-center w-64 h-64">
                        <div className="absolute w-48 h-48 bg-white rounded-full z-10"></div>
                        <div className="absolute w-64 h-64 rounded-full bg-conic-gradient">
                            {SSdata.map((segment, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 rounded-full ${segment.color}`}
                                    style={{
                                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * index / data.datasets.length)}% ${50 + 50 * Math.sin(2 * Math.PI * index / data.datasets.length)}%, ${50 + 50 * Math.cos(2 * Math.PI * (index + 1) / data.datasets.length)}% ${50 + 50 * Math.sin(2 * Math.PI * (index + 1) / data.datasets.length)}%)`,
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Reports;