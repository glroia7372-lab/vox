'use client';

import { useApp } from '@/context/AppContext';

export default function TermsPage() {
    const { showDarkMode } = useApp();

    return (
        <div className={`pt-32 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif mb-12">이용약관</h1>
                <div className="prose prose-lg max-w-none opacity-80 space-y-8 font-light">
                    <section>
                        <h2 className="text-xl font-bold mb-4">제 1 조 (목적)</h2>
                        <p className="leading-relaxed">이 약관은 VOX(이하 "회사")가 운영하는 웹사이트 및 모바일 애플리케이션(이하 "서비스")에서 제공하는 제반 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">제 2 조 (용어의 정의)</h2>
                        <ol className="list-decimal ml-6 space-y-2">
                            <li>"서비스"란 회사가 이용자에게 제공하는 패션 큐레이션, 뉴스레터, 아카이브 등의 정보를 의미합니다.</li>
                            <li>"이용자"란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                            <li>"회원"이란 서비스에 개인정보를 제공하여 등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며 서비스를 이용할 수 있는 자를 말합니다.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">제 3 조 (약관의 명시와 개정)</h2>
                        <p className="leading-relaxed">회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 약관이 개정될 경우 적용일자 및 개정사유를 명시하여 현행약관과 함께 공지합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">제 4 조 (서비스의 제공 및 변경)</h2>
                        <p className="leading-relaxed">회사는 다음과 같은 업무를 수행합니다:</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>패션 및 스타일 관련 정보 제공</li>
                            <li>개인화된 스타일 DNA 분석 데이터 제공</li>
                            <li>기타 회사가 정하는 업무</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">제 5 조 (서비스의 중단)</h2>
                        <p className="leading-relaxed">회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">제 6 조 (회원의 의무)</h2>
                        <p className="leading-relaxed">회원은 다음 행위를 하여서는 안 됩니다:</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>신청 또는 변경 시 허위 내용의 등록</li>
                            <li>타인의 정보 도용</li>
                            <li>서비스에 게시된 정보의 변경</li>
                            <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
