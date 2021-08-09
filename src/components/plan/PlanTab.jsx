import { Tab } from "@headlessui/react";

export const PlanTab = (props) => {
  console.log("TabCompのarrPlansだよ", props.arrPlans);

  // =======================
  const xxx = () => {
    console.log("xxxxx");
  };
  // =======================

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="w-full max-w-md px-2 sm:px-0">
      <Tab.Group
        onChange={(index) => {
          console.log("Changed selected tab to:", index);
          xxx();
        }}
      >
        <Tab.List className="flex p-1 space-x-1 rounded-xl">
          {props.plan.arrDates.map((arrDate, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                classNames(
                  "w-full py-2.5 text-sm leading-5 font-medium rounded-lg",
                  "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-yellow-500 ring-yellow-500 ring-opacity-60",
                  selected
                    ? "bg-yellow-500 text-white shadow"
                    : "hover:bg-yellow-500 hover:text-white"
                )
              }
            >
              {arrDate}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-2">
          {props.arrPlans.map((arrPlan, index) => (
            <Tab.Panel
              key={index}
              className={classNames(
                "bg-white rounded-xl p-3",
                "focus:outline-none focus:ring-1 ring-offset-1 ring-offset-yellow-500 ring-yellow-500 ring-opacity-60"
              )}
            >
              <ul>
                {arrPlan.map((plan) => (
                  <li
                    key={plan.id}
                    className="relative p-3 rounded-md hover:bg-coolGray-100"
                  >
                    <h3 className="text-sm font-medium leading-5">
                      {plan.title}
                    </h3>
                    <ul className="flex mt-1 space-x-1 text-xs font-normal leading-4 text-coolGray-500">
                      {plan.startTime}
                    </ul>
                  </li>
                ))}
              </ul>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
