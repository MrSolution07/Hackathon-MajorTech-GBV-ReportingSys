import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, type PressableProps } from "react-native";
import { Eye, EyeSlash } from "phosphor-react-native";
import { StatusBar } from "expo-status-bar";
import { Wash } from "@/src/components/Wash";
import { useSession } from "@/src/data/session";
import { useApp } from "@/src/theme/Theme";
import { radius, space, type as typeScale } from "@/src/theme/tokens";

export const hitSize = Platform.select({ ios: 44, android: 48, default: 44 }) ?? 44;

const easeOut = Easing.out(Easing.ease);

export function PressableScale({
  children,
  quiet = false,
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps & { quiet?: boolean; children: ReactNode }) {
  const { reduceMotion, colors } = useApp();
  const scale = useSharedValue(1);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPressIn={(event) => {
        setPressed(true);
        if (!quiet && !reduceMotion && !disabled) {
          scale.value = withTiming(0.98, { duration: 160, easing: easeOut });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        scale.value = withTiming(1, { duration: 160, easing: easeOut });
        onPressOut?.(event);
      }}
      style={(state) => [
        focused && Platform.OS === "web"
          ? { outlineWidth: 2, outlineStyle: "solid", outlineColor: colors.accent, outlineOffset: 2 }
          : null,
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <Animated.View style={[animated, disabled ? { opacity: 0.45 } : pressed && quiet ? { opacity: 0.72 } : null]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

type TextVariant = "splash" | "title" | "h2" | "body" | "label" | "caption" | "button";

const variantStyle: Record<TextVariant, TextStyle> = {
  splash: { fontFamily: "BricolageGrotesque_700Bold", fontSize: typeScale.splash, lineHeight: 48, letterSpacing: -1 },
  title: { fontFamily: "BricolageGrotesque_700Bold", fontSize: typeScale.title, lineHeight: 44, letterSpacing: -1 },
  h2: { fontFamily: "BricolageGrotesque_700Bold", fontSize: typeScale.h2, lineHeight: 28 },
  body: { fontFamily: "Geist_400Regular", fontSize: typeScale.body, lineHeight: 24 },
  label: { fontFamily: "Geist_600SemiBold", fontSize: typeScale.label, lineHeight: 20 },
  caption: { fontFamily: "Geist_400Regular", fontSize: typeScale.caption, lineHeight: 20 },
  button: { fontFamily: "Geist_600SemiBold", fontSize: typeScale.button, lineHeight: 22 },
};

export function T({
  variant = "body",
  color,
  center,
  style,
  children,
  ...rest
}: {
  variant?: TextVariant;
  color?: string;
  center?: boolean;
  style?: TextStyle;
  children: ReactNode;
} & Omit<React.ComponentProps<typeof Text>, "style">) {
  const { colors } = useApp();
  return (
    <Text
      allowFontScaling
      style={[
        variantStyle[variant],
        { color: color ?? colors.text },
        center ? { textAlign: "center" } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Button({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled,
  accessibilityHint,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "inverse" | "outline" | "ghost" | "danger";
  icon?: ReactNode;
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  const { colors } = useApp();
  const textColor =
    variant === "primary" ? colors.onCta : variant === "danger" ? colors.danger : colors.ink;
  return (
    <PressableScale
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      quiet={variant === "ghost"}
      style={[
        styles.button,
        variant === "primary" && { backgroundColor: colors.cta },
        variant === "inverse" && { backgroundColor: colors.input, borderWidth: 1, borderColor: colors.edge },
        variant === "outline" && { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.accent },
        variant === "danger" && { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.danger },
        variant === "ghost" && { backgroundColor: "transparent", minHeight: hitSize },
      ]}
    >
      <View style={styles.buttonInner}>
        <T variant="button" color={variant === "outline" || variant === "ghost" ? colors.accent : textColor}>
          {label}
        </T>
        {icon}
      </View>
    </PressableScale>
  );
}

export function Field({
  label,
  error,
  icon,
  secure,
  style,
  multiline,
  ...input
}: {
  label: string;
  error?: string;
  icon?: ReactNode;
  secure?: boolean;
} & TextInputProps) {
  const { colors } = useApp();
  const [hidden, setHidden] = useState(true);
  return (
    <View style={{ gap: space[2] }}>
      <T variant="label" color={colors.ink}>
        {label}
      </T>
      <View
        style={[
          styles.field,
          multiline ? { minHeight: 120, alignItems: "flex-start" } : null,
          { backgroundColor: colors.input, borderColor: error ? colors.danger : colors.fieldBorder },
        ]}
      >
        {icon}
        <TextInput
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text }, multiline ? { minHeight: 96, textAlignVertical: "top" } : null, style]}
          secureTextEntry={secure ? hidden : false}
          autoCorrect={false}
          allowFontScaling
          accessibilityLabel={label}
          multiline={multiline}
          {...input}
        />
        {secure ? (
          <PressableScale
            quiet
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            onPress={() => setHidden((value) => !value)}
            hitSlop={8}
            style={styles.eye}
          >
            {hidden ? <Eye size={22} color={colors.ink} /> : <EyeSlash size={22} color={colors.ink} />}
          </PressableScale>
        ) : null}
      </View>
      {error ? (
        <T variant="caption" color={colors.danger} accessibilityLiveRegion="polite">
          {error}
        </T>
      ) : null}
    </View>
  );
}

export function ErrorSummary({ title = "There is a problem", items }: { title?: string; items: string[] }) {
  const { colors } = useApp();
  const ref = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => {
    if (!items.length || !ref.current) return;
    if (Platform.OS === "web") {
      const node = ref.current as unknown as { focus?: () => void };
      node.focus?.();
      return;
    }
    const handle = findNodeHandle(ref.current);
    if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
  }, [items]);
  if (!items.length) return null;
  return (
    <View
      ref={ref}
      accessible
      accessibilityRole="alert"
      style={[styles.summary, { backgroundColor: colors.warningBg, borderColor: colors.danger }]}
    >
      <T variant="label" color={colors.danger}>
        {title}
      </T>
      {items.map((item) => (
        <T key={item} variant="caption" color={colors.text}>
          {item}
        </T>
      ))}
    </View>
  );
}

export function Screen({
  children,
  footer,
  scroll = true,
  tabbed = false,
  padded = true,
  exit = true,
}: {
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  tabbed?: boolean;
  padded?: boolean;
  exit?: boolean;
}) {
  const { colors } = useApp();
  const { user } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const showExit = exit && !!user;
  const body = (
    <View style={[styles.grow, padded && { paddingHorizontal: space[5], paddingTop: space[2] }]}>
      {showExit ? (
        <View style={styles.exitRow}>
          <PressableScale
            quiet
            accessibilityLabel="Leave quickly"
            onPress={() => router.replace("/cover")}
            style={styles.exit}
          >
            <T variant="caption" color={colors.muted}>
              Leave quickly
            </T>
          </PressableScale>
        </View>
      ) : null}
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.canvas }]}>
      <Wash />
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.column} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          {scroll ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: (footer ? space[4] : insets.bottom + space[6]) + (tabbed ? 72 : 0),
              }}
            >
              {body}
            </ScrollView>
          ) : (
            <View style={[styles.grow, { paddingBottom: tabbed ? 0 : insets.bottom }]}>{body}</View>
          )}
          {footer ? (
            <View
              style={{
                paddingHorizontal: space[5],
                paddingTop: space[3],
                paddingBottom: tabbed ? space[3] : insets.bottom + space[3],
              }}
            >
              {footer}
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: "center" },
  column: { flex: 1, width: "100%", maxWidth: 520 },
  grow: { flex: 1 },
  exitRow: { alignItems: "flex-end" },
  exit: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 },
  button: { borderRadius: 999, overflow: "hidden", minHeight: 52 },
  buttonInner: {
    minHeight: 52,
    paddingHorizontal: space[5],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[2],
  },
  field: {
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingHorizontal: space[4],
    flexDirection: "row",
    alignItems: "center",
    gap: space[3],
  },
  input: { flex: 1, fontFamily: "Geist_400Regular", fontSize: 16, paddingVertical: 12 },
  eye: { width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" },
  summary: { borderWidth: 1, borderRadius: radius.input, padding: space[4], gap: space[1] },
});
