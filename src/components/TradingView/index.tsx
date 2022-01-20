import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createChart, CrosshairMode } from 'lightweight-charts';

import './index.css';
//
export function TVChartContainer() {
  const ref = useRef<null | HTMLDivElement>(null);
  const [dataCandle, setCandleData] = useState([]);
  // const [dataLine, setLineData] = useState([])

  useEffect(() => {
    fetch(
      `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=5m&limit=1000`,
    )
      .then((res) => res.json())
      .then((data) => {
        const cdata = data.map((d) => {
          // console.log(d);
          return {
            time: d[0] / 14400,
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          };
        });
        setCandleData(cdata);
      })
      .catch((err) => console.info(err));
    if (dataCandle && dataCandle.length > 0 && ref.current) {
      const chart = createChart(ref.current, {
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
        layout: {
          backgroundColor: '#222323',
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        crosshair: {
          vertLine: {
            visible: false,
          },
          horzLine: {
            visible: false,
          },
        },
        // grid: {
        //   vertLines: {
        //     color: "#000000",
        //     style: 0,
        //     visible: false,
        //   },
        //   horzLines: {
        //     color: "#000000",
        //     style: 0,
        //     visible: false,
        //   },
        // },
      });

      const candleSeries = chart.addCandlestickSeries();

      candleSeries.setData(dataCandle);

      return () => {
        chart.remove();
      };
    } else {
      console.log('this eerror', ref.current);
    }
  }, [dataCandle]);

  return <div ref={ref} className="TVChartContainer" />;
}

// import * as React from 'react';
// import './index.css';
// import {
//   widget,
//   ChartingLibraryWidgetOptions,
//   IChartingLibraryWidget,
//   ResolutionString,
// } from '../../charting_library/charting_library.min'; // Make sure to folow step 1 of the README
// import { useMarket } from '../../utils/markets';
// import { BONFIDA_DATA_FEED } from '../../utils/bonfidaConnector';
// import { findTVMarketFromAddress } from '../../utils/tradingview';

// // This is a basic example of how to create a TV widget
// // You can add more feature such as storing charts in localStorage

// export interface ChartContainerProps {
//   symbol: ChartingLibraryWidgetOptions['symbol'];
//   interval: ChartingLibraryWidgetOptions['interval'];
//   datafeedUrl: string;
//   libraryPath: ChartingLibraryWidgetOptions['library_path'];
//   chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
//   chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
//   clientId: ChartingLibraryWidgetOptions['client_id'];
//   userId: ChartingLibraryWidgetOptions['user_id'];
//   fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
//   autosize: ChartingLibraryWidgetOptions['autosize'];
//   studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
//   containerId: ChartingLibraryWidgetOptions['container_id'];
//   theme: string;
// }

// export interface ChartContainerState {}

// export const TVChartContainer = () => {
//   // @ts-ignore
//   const defaultProps: ChartContainerProps = {
//     symbol: 'BTC/USDT',
//     interval: '60' as ResolutionString,
//     theme: 'Dark',
//     containerId: 'tv_chart_container',
//     chartsStorageUrl: 'https://saveload.tradingview.com',
//     chartsStorageApiVersion: '1.1',
//     clientId: 'tradingview.com',
//     userId: 'public_user_id',
//     datafeedUrl: BONFIDA_DATA_FEED,
//     libraryPath: '/charting_library/',
//     fullscreen: false,
//     autosize: true,
//     studiesOverrides: {},
//   };

//   // const defaultProps: ChartContainerProps = {
//   //   symbol: 'RAY/USDT',
//   //   interval: '60',
//   //   auto_save_delay: 5,
//   //   theme: 'Dark',
//   //   containerId: 'tv_chart_container',
//   //   libraryPath: '/charting_library/',
//   //   chartsStorageUrl: 'https://saveload.tradingview.com',
//   //   chartsStorageApiVersion: '1.1',
//   //   clientId: 'tradingview.com',
//   //   userId: 'public_user_id',
//   //   fullscreen: false,
//   //   autosize: true,
//   //   studiesOverrides: {},
//   // };

//   const tvWidgetRef = React.useRef<IChartingLibraryWidget | null>(null);
//   const { market } = useMarket();

//   React.useEffect(() => {
//     const widgetOptions: ChartingLibraryWidgetOptions = {
//       symbol: findTVMarketFromAddress(
//         market?.address.toBase58() || '',
//       ) as string,
//       // BEWARE: no trailing slash is expected in feed URL
//       // tslint:disable-next-line:no-any
//       datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
//         defaultProps.datafeedUrl,
//       ),
//       interval: defaultProps.interval as ChartingLibraryWidgetOptions['interval'],
//       container_id: defaultProps.containerId as ChartingLibraryWidgetOptions['container_id'],
//       library_path: defaultProps.libraryPath as string,
//       locale: 'en',
//       disabled_features: ['use_localstorage_for_settings'],
//       enabled_features: ['study_templates'],
//       load_last_chart: true,
//       client_id: defaultProps.clientId,
//       user_id: defaultProps.userId,
//       fullscreen: defaultProps.fullscreen,
//       autosize: defaultProps.autosize,
//       studies_overrides: defaultProps.studiesOverrides,
//       theme: 'Dark',
//     };

//     const tvWidget = new widget(widgetOptions);
//     tvWidgetRef.current = tvWidget;

//     tvWidget.onChartReady(() => {
//       tvWidget.headerReady().then(() => {
//         const button = tvWidget.createButton();
//         button.setAttribute('title', 'Click to show a notification popup');
//         button.classList.add('apply-common-tooltip');
//         button.addEventListener('click', () =>
//           tvWidget.showNoticeDialog({
//             title: 'Notification',
//             body: 'TradingView Charting Library API works correctly',
//             callback: () => {
//               console.log('It works!!');
//             },
//           }),
//         );
//         button.innerHTML = 'Check API';
//       });
//     });
//   }, [market]);

//   return <div id={defaultProps.containerId} className="tradingview-chart" />;
// };
