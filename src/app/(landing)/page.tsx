import React from "react";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import Heading from "@/components/heading";
import { Check } from "lucide-react";
import ShinnyButton from "@/components/shiny-button";
import MockDiscordUi from "@/components/mock-discord-ui";
import { AnimatedList } from "@/components/magicui/animated-list";
import DiscordMessage from "@/components/discord-message";

import Image from "next/image";

const Page = () => {
  return (
    <>
      <section className="relative py-24 sm:py-32 bg-white">
        <MaxWidthWrapper className="text-center">
          <div className="relative mx-auto text-center flex flex-col items-center gap-10">
            <div>
              <Heading>
                <span>Real-Time Saas Insights</span>

                <br />
                <span className="relative bg-gradient-to-r from-fuchsia-500 to-fuchsia-800 text-transparent bg-clip-text">
                  Delivered to Your Discord
                </span>
              </Heading>
            </div>
            <p className="text-base/7 text-gray-600 max-w-prose text-center text-pretty">
              PingPanda is the easiest way to monitor your SaaS. Get instant
              notifications for{" "}
              <span className="font-semibold text-gray-700">
                sales, new users, or any other event
              </span>{" "}
              sent directly to your Discord.
            </p>
            <ul className="space-y-2 text-base/7 text-gray-600 text-left flex flex-col items-start">
              {[
                "Real-time Discord alerts for critical events",
                "Buy once, use forever",
                "Track sales, new users, or any other event",
              ].map((item, index) => (
                <li key={index} className="flex gap-1.5 items-center text-left">
                  <Check className="size-5 shrink-0 text-fuchsia-700" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="w-full max-w-80">
              <ShinnyButton className="relative z-10 h-14 w-full text-base shadow-lg transition-shadow duration-300 hover:shadow-xl">
                Start for Free Today
              </ShinnyButton>
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section className="relative bg-fuchsia-200 pb-4">
        <div className="absolute inset-x-0 bottom-24 top-24 bg-fuchsia-700" />
        <div className="relative mx-auto">
          <MaxWidthWrapper className="relativek">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-500/10 lg:m-4 lg:rounded-2xl lg:p-4">
              <MockDiscordUi>
                <AnimatedList>
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Ping Panda Avatar"
                    userName="PingPanda"
                    timeStamp="Today at 12:35PM"
                    badgeText="SignUp"
                    badgeColor="#43b581"
                    title="🙍‍♂️New User signed in"
                    content={{
                      name: "Mateo Otoo",
                      email: "mateo@gmail.com",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Ping Panda Avatar"
                    userName="PingPanda"
                    timeStamp="Today at 9:00PM"
                    badgeText="Revenue"
                    badgeColor="#faa61a"
                    title="💰Payment Receivied"
                    content={{
                      amount: "$40.00",
                      email: "zoe01@gmail.com",
                      plan: "PRO",
                    }}
                  />
                  <DiscordMessage
                    avatarSrc="/brand-asset-profile-picture.png"
                    avatarAlt="Ping Panda Avatar"
                    userName="PingPanda"
                    timeStamp="Today at 1:00PM"
                    badgeText="Milestone"
                    badgeColor="#5865f2"
                    title="🚀 Revenue Milestone Reached"
                    content={{
                      recurringRevenue: "$500.00 USD",
                      growth: "+8.2%",
                    }}
                  />
                </AnimatedList>
              </MockDiscordUi>
            </div>
          </MaxWidthWrapper>
        </div>
      </section>
      <section className="relative py-24 sm:py-32 bg-fuchsia-50 pb-4">
        <MaxWidthWrapper className="flex flex-col items-center p-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-fuchsia-600">
              Intitutive Monitoring
            </h2>
            <Heading>Stay ahead with real time insights</Heading>
          </div>
          <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
            {/* first bento grid element */}
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]" />
              <div className="relative flex flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg) + 1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-fuchsia-950 max-lg:text-center">
                    Real-time notifications
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text=gray-600 max-lg:text-center">
                    Get notified about critical events as the moment they
                    happen, now matter u are at home or on the go
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900">
                    <Image
                      className="size-full object-cover object-top"
                      src={"/phone-screen.png"}
                      alt="phone-screen"
                      fill
                    />
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]" />
            </div>

            {/* second bento grid element*/}
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-fuchsia-950 max-lg:text-center">
                    Track Any Event
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text=gray-600 max-lg:text-center">
                    from new user sign-up to successful payments, PingPanda
                    notifies you for all the critical events in you SaaS
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                  <Image
                    className="w-full max-lg:max-w-xs object-cover object-top"
                    src={"/bento-any-event.png"}
                    alt="bento-box-event-tracking"
                    width={500}
                    height={300}
                  />
                </div>
              </div>

              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]" />
            </div>

            {/* third bento grid element */}
            <div className="relative max-lg:row-start-3 lg:col-start-2">
              <div className="absolute inset-px rounded-lg bg-white" />
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <p className="mt-2 text-lg/7 font-medium tracking-tight text-fuchsia-950 max-lg:text-center">
                    Track Any Properties
                  </p>
                  <p className="mt-2 max-w-lg text-sm/6 text=gray-600 max-lg:text-center">
                    Add any custom data you like to an event, such as a user
                    email , a purchase amount or an excedded quotal
                  </p>
                </div>
                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                    <Image className="w-full max-lg:max-w-xs" src={'/bento-custom-data.png'} alt="benot box illustatring custom data tracking" width={500} height={300}/>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5" />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>
      <section></section>
    </>
  );
};

export default Page;
