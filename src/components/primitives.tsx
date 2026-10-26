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
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, type PressableProps } from "react-native";
import { Eye, EyeSlash } from "phosphor-react-native";
import { StatusBar } from "expo-status-bar";
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
          scale.value = withTiming(0.96, { duration: 150, easing: easeOut });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        scale.value = withTiming(1, { duration: 150, easing: easeOut });
        onPressOut?.(event);
      }}
      style={(state) => [
        focused && Platform.OS === "web"
          ? { outlineWidth: 2, outlineStyle: "solid", outlineColor: colors.cta, outlineOffset: 2 }
          : null,
        typeof style === "function" ? style(state) : style,
      ]}
      {...rest}
    >
      <Animated.View style={[animated, (quiet && pressed) || disabled ? { opacity: disabled ? 0.45 : 0.72 } : null]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

type TextVariant = "splash" | "title" | "h2" | "body" | "label" | "caption" | "button";

const variantStyle: Record<TextVariant, TextStyle> = {
  splash: { fontFamily: "Inter_600SemiBold", fontSize: typeScale.splash, lineHeight: 58 },
  title: { fontFamily: "Inter_600SemiBold", fontSize: typeScale.title, lineHeight: 34 },
  h2: { fontFamily: "Inter_600SemiBold", fontSize: typeScale.h2, lineHeight: 28 },
  body: { fontFamily: "Inter_400Regular", fontSize: typeScale.body, lineHeight: 24 },
  label: { fontFamily: "Inter_500Medium", fontSize: typeScale.label, lineHeight: 20 },
  caption: { fontFamily: "Inter_400Regular", fontSize: typeScale.caption, lineHeight: 20 },
  button: { fontFamily: "Inter_600SemiBold", fontSize: typeScale.button, lineHeight: 22 },
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
    variant === "primary"
      ? colors.onCta
      : variant === "inverse"
        ? colors.cta
        : variant === "danger"
          ? colors.danger
          : variant === "ghost"
            ? colors.cta
            : colors.cta;

  const inner = (
    <View style={styles.buttonInner}>
      <T variant="button" color={textColor}>
        {label}
      </T>
      {icon}
    </View>
  );

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
        variant === "inverse" && { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: colors.inverseBorder },
        variant === "outline" && { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.cta },
        variant === "danger" && { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.danger },
        variant === "ghost" && { backgroundColor: "transparent", minHeight: hitSize },
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[colors.cta, colors.ctaEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonFill}
        >
          {inner}
        </LinearGradient>
      ) : (
        inner
      )}
    </PressableScale>
  );
}

export function Field({
  label,
  error,
  icon,
  secure,
  style,
  ...input
}: {
  label: string;
  error?: string;
  icon?: ReactNode;
  secure?: boolean;
} & TextInputProps) {
  const { colors } = useApp();
  const [hidden, setHidden] = useState(true);
  const describedBy = error ? `${label} error` : undefined;
  return (
    <View style={{ gap: space[2] }}>
      <T variant="label" color={colors.ink} nativeID={`${label}-label`}>
        {label}
      </T>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.danger : colors.fieldBorder,
          },
        ]}
      >
        {icon}
        <TextInput
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text }, style]}
          secureTextEntry={secure ? hidden : false}
          autoCorrect={false}
          allowFontScaling
          accessibilityLabel={label}
          accessibilityHint={describedBy}
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
            {hidden ? (
              <Eye size={22} color={colors.ink} weight="regular" />
            ) : (
              <EyeSlash size={22} color={colors.ink} weight="regular" />
            )}
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

export function ErrorSummary({
  title = "There is a problem",
  items,
}: {
  title?: string;
  items: string[];
}) {
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
      tabIndex={-1}
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
  tone = "canvas",
  footer,
  scroll = true,
  tabbed = false,
  padded = true,
}: {
  children: ReactNode;
  tone?: "canvas" | "brand" | "sos";
  footer?: ReactNode;
  scroll?: boolean;
  tabbed?: boolean;
  padded?: boolean;
}) {
  const { colors, scheme } = useApp();
  const insets = useSafeAreaInsets();
  const background =
    tone === "brand" ? colors.deep : tone === "sos" ? colors.dangerDeep : colors.canvas;
  const status = tone === "canvas" ? colors.status : "light";
  const body = (
    <View style={[styles.grow, padded && { paddingHorizontal: space[5], paddingTop: space[2] }]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <StatusBar style={tone === "canvas" && scheme === "light" ? "dark" : status} />
      <KeyboardAvoidingView
        style={styles.column}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={{ flex: 1, paddingTop: insets.top }}>
          {scroll ? (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                paddingBottom: (footer ? space[4] : insets.bottom + space[6]) + (tabbed ? space[2] : 0),
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
                paddingBottom: (tabbed ? space[3] : insets.bottom + space[3]),
                backgroundColor: background,
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
  column: { flex: 1, width: "100%", maxWidth: 480 },
  grow: { flex: 1 },
  button: { borderRadius: radius.pill, overflow: "hidden", minHeight: 52 },
  buttonFill: { minHeight: 52, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
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
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, paddingVertical: 12 },
  eye: { width: hitSize, height: hitSize, alignItems: "center", justifyContent: "center" },
  summary: { borderWidth: 1, borderRadius: radius.input, padding: space[4], gap: space[1] },
});
