import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, BarElement } from 'chart.js';

Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, BarElement);

const ChartComponent = ({ selectedGoodCode, dateOrder, quantityOrder, title }) => {
    const data = {
        labels: dateOrder,
        datasets: [
            {
                label: 'Số liệu',
                data: quantityOrder,
                backgroundColor: 'rgba(0, 123, 255, 0.6)', // Blue color for bars
                borderColor: 'rgba(0, 123, 255, 1)', // Blue border color for bars
                borderWidth: 1,
            },
        ],
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 0, // Ngăn chữ bị nghiêng
                        minRotation: 0, // Ngăn chữ bị nghiêng
                    },
                    title: {
                        display: true,
                        text: 'Tháng',
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Số lượng',
                    },
                    ticks: {
                        callback: function (value) {
                            return value.toString();
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed.y || '';
                            return value.toString();
                        }
                    }
                },
                legend: {
                    display: false // Nếu bạn không muốn hiển thị legend
                }
            }
        },
    };

    return (
        <div style={{ width: '500px', height: '500px' }}>
            <Bar data={data} options={config.options} />
            <label>Số lượng {title} của sản phẩm {selectedGoodCode}</label>
        </div>
    );
};

export default ChartComponent;



