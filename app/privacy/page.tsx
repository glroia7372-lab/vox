'use client';

import { useApp } from '@/context/AppContext';

export default function PrivacyPage() {
    const { showDarkMode } = useApp();

    return (
        <div className={`pt-32 px-6 pb-20 min-h-screen ${showDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            <div className="max-max-4xl mx-auto">
                <h1 className="text-4xl font-serif mb-12">개인정보처리방침</h1>
                <div className="prose prose-lg max-w-none opacity-80 space-y-8 font-light">
                    <p className="leading-relaxed leading-relaxed">VOX(이하 "회사")는 「개인정보 보호법」 제30조에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>

                    <section>
                        <h2 className="text-xl font-bold mb-4">1. 개인정보의 처리 목적</h2>
                        <p className="leading-relaxed">회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>홈페이지 회원가입 및 관리: 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등</li>
                            <li>스타일 진단 서비스 제공: 맞춤형 스타일 DNA 분석 및 큐레이션 서비서 제공</li>
                            <li>마케팅 및 광고에의 활용: 신규 서비스 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공 등</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">2. 처리하는 개인정보의 항목</h2>
                        <p className="leading-relaxed">회사는 다음과 같은 개인정보 항목을 처리하고 있습니다.</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>필수항목: 이메일 주소, 이름, 성별, 나이대, 선호 스타일 정보</li>
                            <li>선택항목: 거주지, 관심 브랜드, 쇼핑 빈도</li>
                            <li>서비스 이용 과정에서 자동으로 생성되어 수집될 수 있는 항목: IP주소, 쿠키, 서비스 이용 기록, 접속 로그 등</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">3. 개인정보의 처리 및 보유 기간</h2>
                        <p className="leading-relaxed">회사는 법령에 따른 개인정보 보유·이용기간 또는 이용자로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다. 원칙적으로 회원이 탈퇴할 경우 해당 정보는 즉시 파기됩니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">4. 개인정보의 제3자 제공</h2>
                        <p className="leading-relaxed">회사는 이용자의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 이용자의 동의, 법률의 특별한 규정 등 「개인정보 보호법」 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">5. 이용자의 권리·의무 및 그 행사방법</h2>
                        <p className="leading-relaxed">이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다. 권리 행사는 회사에 대해 서면, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4">6. 개인정보의 안전성 확보 조치</h2>
                        <p className="leading-relaxed">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
                        <ul className="list-disc ml-6 space-y-2 mt-2">
                            <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
                            <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화 등</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
