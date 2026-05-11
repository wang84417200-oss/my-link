export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  createdAt?: any;
  updatedAt?: any;
}

export const dummyLinks: LinkItem[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=instagram.com",
    clicks: 120,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=youtube.com",
    clicks: 350,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "블로그",
    url: "https://blog.example.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=blog.example.com",
    clicks: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=github.com",
    clicks: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://portfolio.example.com",
    icon: "https://s2.googleusercontent.com/s2/favicons?domain=portfolio.example.com",
    clicks: 210,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
