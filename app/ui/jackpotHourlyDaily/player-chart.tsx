import { generateYAxisForPlayerChart } from '@/app/lib/utils/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { PlayerActivity } from '@/app/lib/definitions';


// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default async function PlayerChart(
  {
    playerInfo,
    total_points
  }: {
    playerInfo: PlayerActivity;
    total_points: number
  }
) {
  // const revenue = await fetchRevenue(); // Added this removed Props and delete the page.tsx
  // NOTE: Uncomment this code in Chapter 7

  const { yAxisLabels } = generateYAxisForPlayerChart(playerInfo, total_points);

  // if (total_points <= 10) {
  //   return <p className="mt-4 text-gray-400">Not much data available.</p>;
  // }

  const selectPoints = playerInfo.points_one +
    playerInfo.points_two +
    playerInfo.points_three +
    playerInfo.points_four +
    playerInfo.points_five +
    playerInfo.points_six +
    playerInfo.points_seven +
    playerInfo.points_eight +
    playerInfo.points_nine;

  total_points = selectPoints === 0 ? 1 : selectPoints;

  return (
    <div className="w-full md:col-span-4">
      {/* <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}> */}
      {/* Player Details */}
      {/* </h2> */}
      {/* NOTE: Uncomment this code in Chapter 7 */}

      {
        <div className="rounded-xl bg-gray-50" style={{ background: 'linear-gradient(to bottom, rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '10px' }}>
          <div className="rounded-xl bg-gray-50 p-4 grid grid-rows-10 gap-2" style={{ background: 'linear-gradient(to bottom,rgb(180, 227, 255)), rgb(180, 227, 255))', padding: '10px' }}>
            {/* Draw Hight for Number one*/}
            <div key={'01'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'01'}
              </p>
                <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_one} / ${total_points})`,
                }}
                ></div>
              <p className="text-sm text-black font-bold sm:rotate-0">
                {playerInfo.points_one}
              </p>
            </div>
            {/* Draw Hight for Number two*/}
            <div key={'02'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'02'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_two} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm text-black font-bold sm:rotate-0">
                {playerInfo.points_two}
              </p>
            </div>
            {/* Draw Hight for Number three*/}
            <div key={'03'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'03'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_three} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_three}
              </p>
            </div>
            {/* Draw Hight for Number four*/}
            <div key={'04'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'04'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_four} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_four}
              </p>
            </div>
            {/* Draw Hight for Number five*/}
            <div key={'05'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'05'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_five} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_five}
              </p>
            </div>
            {/* Draw Hight for Number six*/}
            <div key={'06'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'06'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_six} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_six}
              </p>
            </div>
            {/* Draw Hight for Number seven*/}
            <div key={'07'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'07'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_seven} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_seven}
              </p>
            </div>
            {/* Draw Hight for Number eight*/}
            <div key={'08'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'08'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_eight} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_eight}
              </p>
            </div>
            {/* Draw Hight for Number Nine*/}
            <div key={'09'} className="flex flex-row items-center gap-2">
              <p className="text-sm text-black font-bold sm:rotate-0">
                {'09'}
              </p>
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: '20px',
                  width: `calc(100% * ${playerInfo.points_nine} / ${total_points})`,
                }}
              ></div>
              <p className="text-sm ttext-black font-bold sm:rotate-0">
                {playerInfo.points_nine}
              </p>
            </div>
          </div>
        </div>}
    </div>
  );
}
