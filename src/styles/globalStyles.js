import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../constants/theme';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  padding: {
    padding: Spacing.md,
  },
  paddingHorizontal: {
    paddingHorizontal: Spacing.md,
  },
  paddingVertical: {
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.title,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    fontFamily: Typography.families.subtitle,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  body: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.regular,
    fontFamily: Typography.families.body,
    color: Colors.text,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.surface,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.semibold,
  },
});