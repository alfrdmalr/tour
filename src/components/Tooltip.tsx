import * as React from 'react';

import { defaultStyles, WalktourStyles } from '../defaultstyles';
import { WalktourLogic } from './Walktour';

interface TooltipProps extends WalktourLogic {
  styles?: WalktourStyles;
}

export function Tooltip(props: TooltipProps) {
  const {
    next,
    prev,
    close,
    stepContent: {
      title,
      description,
      customTitleRenderer,
      customDescriptionRenderer,
      customFooterRenderer,
      disableClose,
      disableNext,
      disablePrev,
      nextLabel,
      prevLabel,
      closeLabel,
    },
    stepIndex,
    allSteps,
    styles,
  } = {
    styles: defaultStyles,
    ...props,
  };

  const tooltipStyle: React.CSSProperties = {
    ...styles.tooltip,
  };

  const prevDisabled: boolean =
    disablePrev !== undefined ? disablePrev : stepIndex === 0;
  const nextDisabled: boolean =
    disableNext !== undefined ? disableNext : stepIndex + 1 === allSteps.length;

  return (
    <div style={tooltipStyle}>
      {customTitleRenderer
        ? customTitleRenderer(title, props)
        : title && <div style={styles.title}>{title}</div>}

      {customDescriptionRenderer ? (
        customDescriptionRenderer(description, props)
      ) : (
        <div style={styles.description}>{description}</div>
      )}

      {customFooterRenderer ? (
        customFooterRenderer(props)
      ) : (
        <div style={styles.footer}>
          <button
            onClick={() => close()}
            style={{
              ...styles.tertiaryButton,
              ...(disableClose && styles.disabledButton),
            }}
            disabled={disableClose}
          >
            {closeLabel || 'close'}
          </button>
          <button
            onClick={prev}
            disabled={prevDisabled}
            style={{
              ...styles.secondaryButton,
              ...(prevDisabled && styles.disabledButton),
            }}
          >
            {prevLabel || 'prev'}
          </button>
          <button
            onClick={() => next()}
            disabled={nextDisabled}
            style={{
              ...styles.primaryButton,
              ...(nextDisabled && styles.disabledButton),
            }}
          >
            {nextLabel || 'next'}
          </button>
        </div>
      )}
    </div>
  );
}
