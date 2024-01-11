var dom = document.getElementById('chart-container');

var myChart = echarts.init(dom);

var option;

function ShowChart() {
    let rawData = {
        {
            data | safe
        }
    };

    const weatherIcons = {
        Rain: "{% static '/images/showers_128.png' %}",
        Clear: "{% static '/images/sunny_128.png' %}",
        Clouds: "{% static '/images/cloudy_128.png' %}"
    };
    const directionMap = {};
    // prettier-ignore
    ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'].forEach(function(name, index) {
        directionMap[name] = Math.PI / 8 * index;
    });
    const data = rawData.data.map(function(entry) {
        return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
    });
    const weatherData = rawData.forecast.map(function(entry) {
        return [
            entry.localDate,
            0,
            weatherIcons[entry.skyIcon],
            entry.minTemp,
            entry.maxTemp
        ];
    });
    const dims = {
        time: 0,
        windSpeed: 1,
        R: 2,
        waveHeight: 3,
        weatherIcon: 2,
        minTemp: 3,
        maxTemp: 4
    };
    const arrowSize = 18;
    const weatherIconSize = 45;
    const renderArrow = function(param, api) {
        const point = api.coord([
            api.value(dims.time),
            api.value(dims.windSpeed)
        ]);
        return {
            type: 'path',
            shape: {
                pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                x: -arrowSize / 2,
                y: -arrowSize / 2,
                width: arrowSize,
                height: arrowSize
            },
            rotation: directionMap[api.value(dims.R)],
            position: point,
            style: api.style({
                stroke: '#555',
                lineWidth: 1
            })
        };
    };
    const renderWeather = function(param, api) {
        const point = api.coord([
            api.value(dims.time) + (3600 * 24 * 1000) / 2,
            0
        ]);
        return {
            type: 'group',
            children: [{
                    type: 'image',
                    style: {
                        image: api.value(dims.weatherIcon),
                        x: -weatherIconSize / 2,
                        y: -weatherIconSize / 2,
                        width: weatherIconSize,
                        height: weatherIconSize
                    },
                    position: [point[0], 110]
                },
                {
                    type: 'text',
                    style: {
                        text: api.value(dims.minTemp) + ' - ' + api.value(dims.maxTemp) + '°',
                        textFont: api.font({
                            fontSize: 14
                        }),
                        textAlign: 'center',
                        textVerticalAlign: 'bottom'
                    },
                    position: [point[0], 80]
                }
            ]
        };
    };
    option = {
        title: {
            text: 'Previsão próximos 5 dias',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return [
                    echarts.format.formatTime(
                        'yyyy-MM-dd',
                        params[0].value[dims.time]
                    ) +
                    ' ' +
                    echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                    'Velocidade: ' + params[0].value[dims.windSpeed],
                    'Direção' + params[0].value[dims.R],
                    'Tamanho:' + params[0].value[dims.waveHeight]
                ].join('<br>');
            }
        },
        grid: {
            top: 160,
            bottom: 125
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24,
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        yAxis: [{
                name: 'Velocidade do Vento',
                nameLocation: 'middle',
                nameGap: 35,
                axisLine: {
                    lineStyle: {
                        color: '#666'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: '#ddd'
                    }
                }
            },
            {
                name: 'Altura da Onda',
                nameLocation: 'middle',
                nameGap: 35,
                max: 6,
                axisLine: {
                    lineStyle: {
                        color: '#015DD5'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
        ],
        visualMap: {
            type: 'piecewise',
            // show: false,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            pieces: [{
                    gte: 2,
                    color: '#18BF12',
                    label: 'Ventos (>=2)）'
                },
                {
                    gte: 1,
                    lt: 2,
                    color: '#f4e9a3',
                    label: 'Ventos (<2)'
                },
                {
                    lt: 1,
                    color: '#D33C3E',
                    label: 'Ventos (<1)'
                }
            ],
            seriesIndex: 1,
            dimension: 1
        },
        dataZoom: [{
                type: 'inside',
                xAxisIndex: 0,
                minSpan: 5
            },
            {
                type: 'slider',
                xAxisIndex: 0,
                minSpan: 5,
                bottom: 50
            }
        ],
        series: [{
                type: 'line',
                yAxisIndex: 1,
                showSymbol: false,
                emphasis: {
                    scale: false
                },
                symbolSize: 10,
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        global: false,
                        colorStops: [{
                                offset: 0,
                                color: 'rgba(88,160,253,1)'
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(88,160,253,0.7)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(88,160,253,0)'
                            }
                        ]
                    }
                },
                lineStyle: {
                    color: 'rgba(88,160,253,1)'
                },
                itemStyle: {
                    color: 'rgba(88,160,253,1)'
                },
                encode: {
                    x: dims.time,
                    y: dims.waveHeight
                },
                data: data,
                z: 2
            },
            {
                type: 'custom',
                renderItem: renderArrow,
                encode: {
                    x: dims.time,
                    y: dims.windSpeed
                },
                data: data,
                z: 10
            },
            {
                type: 'line',
                symbol: 'none',
                encode: {
                    x: dims.time,
                    y: dims.windSpeed
                },
                lineStyle: {
                    color: '#aaa',
                    type: 'dotted'
                },
                data: data,
                z: 1
            },
            {
                type: 'custom',
                renderItem: renderWeather,
                data: weatherData,
                tooltip: {
                    trigger: 'item',
                    formatter: function(param) {
                        return (
                            param.value[dims.time]
                        );
                    }
                },
                yAxisIndex: 2,
                z: 11
            }
        ]
    };
    myChart.setOption(option);
}

ShowChart();

option && myChart.setOption(option);

var dom = document.getElementById('chart-humidity');
var humidityChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

var option;

// prettier-ignore
const hours = [
    '24h', '1h', '2h', '3h', '4h', '5h', '6h',
    '7h', '8h', '9h', '10h', '11h',
    '12h', '13h', '14h', '15h', '16h', '17h',
    '18h', '19h', '20h', '21h', '22h', '23h'
];
// prettier-ignore
const days = [
    'Sábado', 'Sexta', 'Quinta',
    'Quarta', 'Terça', 'Segunda', 'Domingo'
];
// prettier-ignore
const data = {
    {
        data_humidity | safe
    }
};
const title = [];
const singleAxis = [];
const series = [];
days.forEach(function(day, idx) {
    title.push({
        textBaseline: 'middle',
        top: ((idx + 0.5) * 100) / 5 + '%',
        text: day
    });
    singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx * 100) / 5 + 5 + '%',
        height: 100 / 5 - 10 + '%',
        axisLabel: {
            interval: 2
        }
    });
    series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function(dataItem) {
            return dataItem[1] * 0.5;
        }
    });
});

data.forEach(function(dataItem) {
    series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
});

option = {
    tooltip: {
        position: 'top',
        formatter: (params) => {
            return `
                        Horário: ${params.data[0]}h<br />
                        Humidade: ${params.data[1]}%<br />
                    `;
        },
    },
    title: title,
    singleAxis: singleAxis,
    series: series
};

humidityChart.setOption(option);