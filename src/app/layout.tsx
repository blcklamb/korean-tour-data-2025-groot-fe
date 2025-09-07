import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import BottomFixedNavigator from "@/components/ui/bottom-fixed-navigator";
import {
  AppShell,
  AppShellMain,
  ColorSchemeScript,
  Container,
  MantineProvider,
  createTheme,
  mantineHtmlProps,
} from "@mantine/core";

export const metadata = {
  title: "Groot | 관광데이터 활용 공모전 2025",
  description: "지속 가능한 생태관광 인증 플랫폼",
};

const theme = createTheme({
  fontFamily: "Pretendard, sans-serif",
  primaryColor: "eco-green",
  colors: {
    "eco-green": [
      "#eafcf1",
      "#d9f6e3",
      "#b1ebc7",
      "#87e0a7",
      "#64d78d",
      "#4ed17c",
      "#41ce73",
      "#32b661",
      "#27a154",
      "#158c46",
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <AppShell padding="md" header={{ height: 60 }}>
            <AppShellMain>
              <Container maw={"30rem"}>{children}</Container>
              <Container h={"5rem"} />
            </AppShellMain>
            <BottomFixedNavigator />
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
