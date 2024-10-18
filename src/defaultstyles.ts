import { CSSProperties } from 'react';

export interface WalktourStyles {
  tooltip: CSSProperties;
  footer: CSSProperties;
  title: CSSProperties;
  description: CSSProperties;
  primaryButton: CSSProperties;
  secondaryButton: CSSProperties;
  tertiaryButton: CSSProperties;
  disabledButton: CSSProperties;
}

const contentMargin: number = 4;
const baseButtonStyle: React.CSSProperties = {
  cursor: 'pointer',
  padding: '4px 16px',
  textAlign: 'center',
  border: 0,
  borderRadius: 3,
  backgroundColor: '#0084ff',
  color: '#fff',
  fontSize: 14,
  margin: contentMargin,
};

export const defaultStyles: WalktourStyles = {
  tooltip: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 9999,
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    backgroundColor: 'white',
    padding: '10px 10px 5px 10px',
    borderRadius: '5px',
    boxShadow: '0 3px 8px 0 rgba(0,0,0,.25)',
    color: '#4d4d4d',
    minWidth: 215, //so that buttons have adequate spacing
    maxWidth: 285,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: contentMargin,
  },
  title: {
    margin: contentMargin,
    fontSize: 24,
  },
  description: {
    margin: contentMargin,
  },
  primaryButton: {
    ...baseButtonStyle,
    backgroundColor: '#0084ff',
    color: '#ffffff',
  },
  secondaryButton: {
    ...baseButtonStyle,
    backgroundColor: '#8400ff',
    color: '#fff',
    border: 'solid 1px #8400ff',
  },
  tertiaryButton: {
    ...baseButtonStyle,
    marginRight: 'auto',
    backgroundColor: `transparent`,
    color: '#025c53',
    border: 'solid 1px #025c53',
  },
  disabledButton: {
    ...baseButtonStyle,
    backgroundColor: '#bebebe',
    color: '#989898',
    cursor: 'default',
  },
};
