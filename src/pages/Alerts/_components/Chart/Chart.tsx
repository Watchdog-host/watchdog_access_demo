import { ApexOptions } from "apexcharts";
import { svgVariables } from "constants/common";
import { AlertTypeEnum } from "constants/enums";
import { useMemo } from "react";
import Chart from "react-apexcharts";
import { useDevicesQuery } from "store/endpoints";
import { useAppSelector } from "store/hooks";
import { IAccessAlertsDTO } from "types";
import classes from './Chart.module.scss'

interface Props {
  data: IAccessAlertsDTO | undefined
}

const Charts: React.FC<Props> = ({ data }) => {
  const { currentEdge } = useAppSelector((state) => state.navigation)
  const { data: devicesData } = useDevicesQuery({ filter: { edge_id: currentEdge?.id || 0 } })

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
        name: AlertTypeEnum[0],
        data: data?.groups?.map(({ information_amount }) => information_amount) || [],
        color: svgVariables.$blue
      },
      {
        name: AlertTypeEnum[1],
        data: data?.groups?.map(({ warning_amount }) => warning_amount) || [],
        color: svgVariables.$yellow
      },
      {
        name: AlertTypeEnum[2],
        data: data?.groups?.map(({ critical_amount }) => critical_amount) || [],
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
