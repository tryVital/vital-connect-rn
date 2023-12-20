import {Text as GText} from '@gluestack-ui/themed';
import {AppConfig} from '../../lib/config';
import {RNStyledProps} from '@gluestack-style/react/lib/typescript/types';
import {useTheme} from '@react-navigation/native';

interface VitalTextProps {
  fontType: 'regular' | 'medium' | 'bold' | 'light';
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right" | "justify" | undefined;
  pr?: number;
}

export const Text = ({
  children,
  fontType,
  fontSize,
  fontWeight,
  textAlign,
  pr,
  ...props
}: VitalTextProps) => {
  const {colors} = useTheme();

  return (
    <GText
      color={colors.text}
      fontWeight={fontWeight}
      fontSize={fontSize}
      textAlign={textAlign}
      fontFamily={AppConfig.fonts[fontType]}
      pr={pr}
      {...props}
      flexWrap={'wrap'}>
      {children}
    </GText>
  );
};

export const H1 = ({
  children,
  textAlign,
  ...props
}: {
  children: React.ReactNode;
  textAlign?: string;
  props?: RNStyledProps;
}) => {
  const {colors} = useTheme();

  return (
    <GText
      size="xl"
      bold
      fontFamily={AppConfig.fonts['bold']}
      color={colors.text}
      {...props}>
      {children}
    </GText>
  );
};

export const H2 = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  props?: RNStyledProps;
}) => {
  const {colors} = useTheme();

  return (
    <GText
      size="md"
      bold
      fontFamily={AppConfig.fonts['bold']}
      color={colors.text}
      {...props}>
      {children}
    </GText>
  );
};
