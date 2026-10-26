import { useRef, useState, type ComponentRef } from "react";
import { BackHandler, ScrollView, useWindowDimensions, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ArrowRight, ChatCircle, Siren } from "phosphor-react-native";
import { useCallback } from "react";
import { MapArt } from "@/src/components/MapArt";
import { Button, hitSize, PressableScale, Screen, T } from "@/src/components/primitives";
import { useApp } from "@/src/theme/Theme";
import { space } from "@/src/theme/tokens";

const slides = [
  {
    tone: "brand" as const,
    title: "Safer Routes. Stronger Women.",
    body: "SafeStep helps you find safe routes, report dangers and get help — all in one app.",
    art: "brand" as const,
  },
  {
    tone: "canvas" as const,
    title: "Safe Routes, Real-Time Safety",
    body: "Get AI-powered safety scores for streets, tracks and transport options based on lighting, foot traffic, taxi ranks and past reports.",
    art: "map" as const,
  },
  {
    tone: "canvas" as const,
    title: "Report Anonymously",
    body: "Use our WhatsApp bot to report harassment, unsafe spots or broken streetlights. No personal info needed.",
    art: "chat" as const,
  },
  {
    tone: "brand" as const,
    title: "Emergency Support",
    body: "One tap to Namola’s existing emergency response network. You’re never alone.",
    art: "sos" as const,
  },
];

export default function Welcome() {
  const router = useRouter();
  const { colors, reduceMotion } = useApp();
  const { width } = useWindowDimensions();
  const page = Math.min(width, 480);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    setIndex(clamped);
    scroller.current?.scrollTo({ x: clamped * page, animated: !reduceMotion });
  };

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (index > 0) {
          go(index - 1);
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [index, page, reduceMotion]),
  );

  const finish = () => router.push("/finale");

  return (
    <Screen
      tone={slide.tone}
      scroll={false}
      padded={false}
      footer={
        <View style={{ gap: space[3] }}>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: space[1] }}>
            {slides.map((item, dot) => {
              const selected = dot === index;
              return (
                <PressableScale
                  key={item.title}
                  quiet
                  accessibilityLabel={`Slide ${dot + 1} of ${slides.length}`}
                  accessibilityState={{ selected }}
                  onPress={() => go(dot)}
                  style={{ minWidth: hitSize, minHeight: hitSize, alignItems: "center", justifyContent: "center" }}
                >
                  <View
                    style={{
                      width: selected ? 22 : 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: slide.tone === "brand" ? "#FFFFFF" : colors.cta,
                      opacity: selected ? 1 : 0.35,
                    }}
                  />
                </PressableScale>
              );
            })}
          </View>
          <Button
            variant={slide.tone === "brand" ? "inverse" : "primary"}
            label={index === slides.length - 1 ? "Get Started" : "Next"}
            icon={
              index === slides.length - 1 ? undefined : (
                <ArrowRight size={18} color={slide.tone === "brand" ? "#5930C5" : "#FFFFFF"} weight="bold" />
              )
            }
            onPress={() => (index === slides.length - 1 ? finish() : go(index + 1))}
          />
        </View>
      }
    >
      <ScrollView
        ref={scroller}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onMomentumScrollEnd={(event) => {
          const next = Math.round(event.nativeEvent.contentOffset.x / page);
          setIndex(next);
        }}
        style={{ flex: 1 }}
      >
        {slides.map((item) => {
          const light = item.tone === "canvas";
          return (
            <View key={item.title} style={{ width: page, flex: 1, paddingHorizontal: space[5], paddingTop: space[4], justifyContent: "center", gap: space[4] }}>
              {item.art === "map" ? <MapArt height={220} /> : null}
              {item.art === "chat" ? (
                <View style={{ height: 180, borderRadius: 24, backgroundColor: colors.chip, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.imageOutline }}>
                  <ChatCircle size={72} color={colors.cta} weight="duotone" />
                </View>
              ) : null}
              {item.art === "sos" ? (
                <View style={{ alignItems: "center" }}>
                  <Siren size={72} color="#FFFFFF" weight="duotone" />
                </View>
              ) : null}
              <T variant="title" color={light ? colors.ink : "#FFFFFF"} accessibilityRole="header">
                {item.title}
              </T>
              <T variant="body" color={light ? colors.muted : "#FFFFFF"}>
                {item.body}
              </T>
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
