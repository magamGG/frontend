function Frame1() {
  return <div className="bg-[#e0e0e0] h-[10px] rounded-[15px] shrink-0 w-[458px]" />;
}

function Frame2() {
  return (
    <div className="bg-[#7350a9] content-stretch flex items-center justify-center relative rounded-[15px] shrink-0 w-[66px]">
      <p className="css-ew64yg font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[10px] relative shrink-0 text-[10px] text-center text-white">코드 확인</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="h-[30px] relative shrink-0 w-[539px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[5px] items-start justify-center px-[5px] py-[3px] relative size-full">
        <p className="css-4hzbpn font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal h-[10px] leading-[10px] relative shrink-0 text-[10px] text-black text-center w-[44px]">회사 코드</p>
        <Frame3 />
      </div>
    </div>
  );
}

export default function Card() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative rounded-[16px] size-full" data-name="Card">
      <Frame />
    </div>
  );
}