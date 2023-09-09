import { ApexOptions } from "apexcharts";
import { svgVariables } from "constants/common";
import { AlertTypeEnum } from "constants/enums";
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useDevicesQuery } from "store/endpoints";
import { useAppSelector } from "store/hooks";
import { IAccessAlertsDTO, IAccessRevenueDTO } from "types";
import classes from './Chart.module.scss'

interface Props {
  data: IAccessRevenueDTO | undefined
}

const Charts: React.FC<Props> = ({ data }) => {
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { data: devicesData } = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0 } })

    //   "groups": [
  //     {
  //       "device_id": 1,
  //       "paid_amount": 70000,
  //       "debt_amount": 1500000
  //     },
  //     {
  //       "device_id": 2,
  //       "paid_amount": 90000,
  //       "debt_amount": 2500000
  //     }
  //   ]
  const options: ApexOptions = useMemo(() => ({
    chart: {
      id: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },

    series: [
      {
        name: 'Paid',
        data: data?.groups?.map(({ paid_amount }) => paid_amount) || [],
        color: svgVariables.$green
      },
      {
        name: 'Debt',
        data: data?.groups?.map(({ debt_amount }) => debt_amount) || [],
        color: svgVariables.$red
      },
    ],
    xaxis: {
      type: 'category',
      categories: data?.groups?.map((info) => devicesData?.find((device) => device.id === info.device_id)?.title || '') || [],
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: false,
        hideOverlappingLabels: true,
        showDuplicates: false,
        trim: false,
        minHeight: undefined,
        maxHeight: 120,
        style: {
          colors: [svgVariables.$dark],
          cssClass: ''
        }
      },
    },
    legend: {
      show: false,
    },
    
  }), [devicesData, data])


  return (
    <div className={classes.chart}>
      <Chart
        height={170}
        options={options}
        series={options.series}
        type="bar"
      />
    </div>
  );
};

export default Charts;
