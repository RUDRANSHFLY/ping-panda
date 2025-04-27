import React, { PropsWithChildren } from "react";
import { Icons } from "./icons";
import { InboxIcon, PlusCircleIcon, UserCircleIcon } from "lucide-react";
import Image from "next/image";

const MockDiscordUi = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-[800px] w-full max-w-[1200px] bg-discord-background text-white rounded-lg overflow-hidden shadow-xl">
      {children}
      {/* sever's list */}
      <div className="hidden sm:flex w-[72px] bg-[#202225] py-3 flex-col items-center">
        <div className="size-12 bg-discord-brand-color rounded-2xl flex items-center justify-center mb-2 hover:rounded-xl transition-all duration-200">
          <Icons.discord className="size-3/5 text-white" />
        </div>
        <div className="w-8 h-[2px] bg-discord-background rounded-full my-2" />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="
                    size-12 bg-discord-background rounded-3xl flex items-center justify-center mb-3 hover:rounded-xl transition-all duration-200 hover:bg-discord-brand-color cursor-not-allowed"
          >
            <span>{String.fromCharCode(65 + i)}</span>
          </div>
        ))}

        <div
          className="group mt-auto
                    size-12 bg-discord-background rounded-3xl flex items-center justify-center mb-3 hover:rounded-xl transition-all duration-200 hover:bg-[#3ba55c] cursor-not-allowed"
        >
          <PlusCircleIcon className={"text-[#3ba55c] group-hover:text-white"} />
        </div>
      </div>

      {/* dm list */}
      <div className="hidden md:flex w-60 bg-[#2f3136] flex-col">
        <div className="px-4 h-16 border-b border-[#202225] flex items-center shadow-sm">
          <div className="w-full bg-[#202225] text-sm rounded px-2 h-8 flex items-center justify-center text-gray-500 cursor-not-allowed">
            Find or start a conservation
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <div className="px-2 mb-4">
            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <UserCircleIcon className="mr-4 size-8 text-[#b9bbee]" />
              <span className="font-medium text-sm">friends</span>
            </div>

            <div className="flex items-center text-sm px-2 py-1.5 rounded hover:bg-[#393c43] text-[#dcddde] cursor-not-allowed">
              <InboxIcon className="mr-4 size-8 text-[#b9bbee]" />
              <span className="font-medium text-sm">nitro</span>
            </div>
          </div>

          <div className="px-2 mb-4">
              <h3 className="text-xs font-semibold text-[#8e9297] px-2 mb-2 uppercase">
                  Direct Messages
              </h3>
              <div className="flex items-center px-2 py-1.5 rounded bg-[#393c43] text-white cursor-pointer">
                <Image src={'/brand-asset-profile-picture.png'} alt={'ping panda'} width={32} height={32} className="object-cover rounded-full mr-3" />
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MockDiscordUi;
