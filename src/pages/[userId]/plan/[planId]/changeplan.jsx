import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "src/utils/firebase/firebase";
import { Emoji } from "emoji-mart";
import { useRequireLogin } from "src/hooks/auth/useRequireLogin";
import { CommonLayout } from "src/components/layouts/CommonLayout";
import { ExclamationIcon } from "src/components/common/assets/ExclamationIcon";
import { Dropdown } from "src/components/plan/Dropdown";
import Link from "next/link";
import { CheckCircleIcon } from "src/components/common/assets/CheckCircleIcon";

const Changeplan = () => {
  const [docData, setDocData] = useState();
  const [arrChangePlans, setArrChangePlans] = useState([]);

  const router = useRouter();

  useRequireLogin();

  useEffect(() => {
    getChangeDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChangeDate = async () => {
    const planDoc = db.collection("plans").doc(router.query.planId);
    const dateChange = await planDoc
      .collection("plan")
      .where("dateChange", "==", true)
      .get();

    planDoc.get().then((doc) => {
      const data = doc.data();
      setDocData(data);
    });

    const dateChangeArr = [];

    dateChange.forEach((doc) => {
      const data = doc.data();
      dateChangeArr.push({
        id: doc.id,
        planIcon: data.planIcon,
        title: data.title,
        startTime: data.startTime,
        lastTime: data.lastTime,
        memo: data.memo,
        money: data.money.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"),
      });
    });

    setArrChangePlans(dateChangeArr);
  };

  return (
    <CommonLayout>
      {docData ? (
        docData?.unnecessaryDate ? (
          <>
            <div className="py-8 px-3">
              <div className="flex items-center">
                <ExclamationIcon class="text-red-500" />
                <div className="pl-1 font-bold">
                  日付の変更、または削除が必要なデータ
                </div>
              </div>
              <p className="pt-3 pl-4 text-xs">
                (プラン右下の…ボタンから日付の変更、または削除をしてください。)
              </p>
            </div>

            <ul className="px-4">
              {arrChangePlans.map((arrChangePlan, index) => (
                <li
                  key={index}
                  className="bg-white text-sm mb-5 pt-5 px-5 pb-9 rounded-md relative"
                >
                  <div className="font-semibold flex items-center">
                    <div className="flex flex-col items-center">
                      <p>{arrChangePlan.startTime}</p>
                      {arrChangePlan.lastTime && (
                        <>
                          <p className="text-xxs transform rotate-90">〜</p>
                          <p>{arrChangePlan.lastTime}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center pl-3">
                      {arrChangePlan.planIcon ? (
                        <div className="pt-3 pr-1.5">
                          <Emoji emoji={arrChangePlan.planIcon} size={18} />
                        </div>
                      ) : null}
                      <div className="pt-1 font-semibold">
                        {arrChangePlan.title}
                      </div>
                    </div>
                  </div>

                  {arrChangePlan.memo && (
                    <div className="mt-4 pt-4 text-xs border-dotted border-t-2 border-gray-400 whitespace-pre-wrap">
                      {arrChangePlan.memo}
                    </div>
                  )}

                  {arrChangePlan.money && (
                    <p className="mt-4 pt-4 text-xs pr-2 text-right border-dotted border-t-2 border-gray-400">{`金額：¥${arrChangePlan.money}`}</p>
                  )}
                  <Dropdown
                    page="changeDetailPage"
                    arrChangePlans={arrChangePlans}
                    plan={arrChangePlan}
                    docData={docData}
                    getPage={getChangeDate}
                    query={router.query.planId}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="pt-14 pb-20 px-4">
              <div className="flex">
                <CheckCircleIcon class="text-green-400" />
                <p>変更が必要なデータがなくなりました。</p>
              </div>
            </div>
            <Link
              href="/[userId]/plan/[planId]"
              as={`/${router.query.userId}/plan/${router.query.planId}`}
            >
              <a className="bg-yellow-400 mx-5 py-3 text-sm font-semibold text-center block border-4 border-yellow-500 rounded-lg">
                プランページにもどる →
              </a>
            </Link>
          </>
        )
      ) : (
        <>
          {[1, 2, 3, 4].map((number) => (
            <div
              key={number}
              className="h-24 mb-5 mx-4 py-3 px-2 rounded-xl bg-white bg-opacity-50"
            >
              <div className="animate-pulse flex space-x-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-4">
                  <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </CommonLayout>
  );
};

export default Changeplan;
