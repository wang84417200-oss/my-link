import { dummyLinks } from "@/data/link";
import { Card, CardContent } from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <main className="mx-auto flex w-full max-w-md flex-col items-center gap-8 pt-10">
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* 아바타 플레이스홀더 (기본 텍스트 형태 등) */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted text-4xl text-muted-foreground">
            <span role="img" aria-label="프로필">🧑‍💻</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">@MyLinkProfile</h1>
            <p className="mt-1 text-sm text-muted-foreground">나만의 모든 링크를 한 곳에서 확인하세요</p>
          </div>
        </div>

        {/* Links List */}
        <div className="flex w-full flex-col gap-4">
          {dummyLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Card className="group overflow-hidden border-border bg-card shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* 아이콘 */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-xs">
                    {link.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={link.icon}
                        alt={`${link.title} icon`}
                        className="h-6 w-6"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-muted" />
                    )}
                  </div>
                  
                  {/* 타이틀 */}
                  <div className="flex flex-1 flex-col justify-center">
                    <span className="text-lg font-semibold tracking-tight">{link.title}</span>
                  </div>
                  
                  {/* 클릭수 뱃지 */}
                  <div className="hidden shrink-0 items-center justify-center rounded-full bg-muted/80 px-3 py-1 text-xs font-medium text-muted-foreground group-hover:flex">
                    클릭 {link.clicks}회
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
