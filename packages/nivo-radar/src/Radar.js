/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import max from 'lodash/max'
import React from 'react'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import pure from 'recompose/pure'
import withPropsOnChange from 'recompose/withPropsOnChange'
import defaultProps from 'recompose/defaultProps'
import { scaleLinear } from 'd3-scale'
import { closedCurvePropType } from '@nivo/core'
import { withTheme, withColors, withCurve, withDimensions, withMotion } from '@nivo/core'
import { getAccessorFor } from '@nivo/core'
import { Container, SvgWrapper } from '@nivo/core'
import { LegendPropShape, BoxLegendSvg } from '@nivo/legends'
import RadarShapes from './RadarShapes'
import RadarGrid from './RadarGrid'
import RadarTooltip from './RadarTooltip'
import RadarDots from './RadarDots'

const Radar = ({
    data,
    keys,
    getIndex,
    indices,

    curveInterpolator,

    radius,
    radiusScale,
    angleStep,

    // dimensions
    centerX,
    centerY,
    margin,
    width,
    height,
    outerWidth,
    outerHeight,

    // border
    borderWidth,
    borderColor,

    // grid
    gridLevels,
    gridShape,
    gridLabelOffset,

    // dots
    enableDots,
    dotSymbol,
    dotSize,
    dotColor,
    dotBorderWidth,
    dotBorderColor,
    enableDotLabel,
    dotLabel,
    dotLabelFormat,
    dotLabelYOffset,

    // theming
    theme,
    fillOpacity,
    colorByKey,

    // motion
    animate,
    motionStiffness,
    motionDamping,

    // interactivity
    isInteractive,
    tooltipFormat,

    legends,
}) => {
    const motionProps = {
        animate,
        motionDamping,
        motionStiffness,
    }

    const legendData = keys.map(key => ({
        label: key,
        fill: colorByKey[key],
    }))

    return (
        <Container isInteractive={isInteractive} theme={theme}>
            {({ showTooltip, hideTooltip }) => (
                <SvgWrapper width={outerWidth} height={outerHeight} margin={margin}>
                    <g transform={`translate(${centerX}, ${centerY})`}>
                        <RadarGrid
                            levels={gridLevels}
                            shape={gridShape}
                            radius={radius}
                            angleStep={angleStep}
                            theme={theme}
                            indices={indices}
                            labelOffset={gridLabelOffset}
                            {...motionProps}
                        />
                        <RadarShapes
                            data={data}
                            keys={keys}
                            colorByKey={colorByKey}
                            radiusScale={radiusScale}
                            angleStep={angleStep}
                            curveInterpolator={curveInterpolator}
                            borderWidth={borderWidth}
                            borderColor={borderColor}
                            fillOpacity={fillOpacity}
                            {...motionProps}
                        />
                        {isInteractive && (
                            <RadarTooltip
                                data={data}
                                keys={keys}
                                getIndex={getIndex}
                                colorByKey={colorByKey}
                                radius={radius}
                                angleStep={angleStep}
                                theme={theme}
                                tooltipFormat={tooltipFormat}
                                showTooltip={showTooltip}
                                hideTooltip={hideTooltip}
                            />
                        )}
                        {enableDots && (
                            <RadarDots
                                data={data}
                                keys={keys}
                                getIndex={getIndex}
                                radiusScale={radiusScale}
                                angleStep={angleStep}
                                symbol={dotSymbol}
                                size={dotSize}
                                colorByKey={colorByKey}
                                color={dotColor}
                                borderWidth={dotBorderWidth}
                                borderColor={dotBorderColor}
                                enableLabel={enableDotLabel}
                                label={dotLabel}
                                labelFormat={dotLabelFormat}
                                labelYOffset={dotLabelYOffset}
                                theme={theme}
                                {...motionProps}
                            />
                        )}
                    </g>
                    {legends.map((legend, i) => (
                        <BoxLegendSvg
                            key={i}
                            {...legend}
                            containerWidth={width}
                            containerHeight={height}
                            data={legendData}
                        />
                    ))}
                </SvgWrapper>
            )}
        </Container>
    )
}

Radar.propTypes = {
    // data
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    keys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
    indexBy: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.func]).isRequired,
    getIndex: PropTypes.func.isRequired, // computed
    indices: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
        .isRequired, // computed

    curve: closedCurvePropType.isRequired,
    curveInterpolator: PropTypes.func.isRequired, // computed

    // border
    borderWidth: PropTypes.number.isRequired,
    borderColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

    // grid
    gridLevels: PropTypes.number,
    gridShape: PropTypes.oneOf(['circular', 'linear']),
    gridLabelOffset: PropTypes.number,

    // dots
    enableDots: PropTypes.bool.isRequired,
    dotSymbol: PropTypes.func,
    dotSize: PropTypes.number,
    dotColor: PropTypes.any,
    dotBorderWidth: PropTypes.number,
    dotBorderColor: PropTypes.any,
    enableDotLabel: PropTypes.bool,
    dotLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    dotLabelFormat: PropTypes.string,
    dotLabelYOffset: PropTypes.number,

    // theming
    getColor: PropTypes.func.isRequired, // computed
    colorByKey: PropTypes.object.isRequired, // computed
    fillOpacity: PropTypes.number.isRequired,

    // interactivity
    isInteractive: PropTypes.bool.isRequired,
    tooltipFormat: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

    legends: PropTypes.arrayOf(PropTypes.shape(LegendPropShape)).isRequired,
}

export const RadarDefaultProps = {
    curve: 'linearClosed',

    // border
    borderWidth: 2,
    borderColor: 'inherit',

    // grid
    gridLevels: 5,
    gridShape: 'circular',
    gridLabelOffset: 16,

    // dots
    enableDots: true,

    // theming
    fillOpacity: 0.15,

    // interactivity
    isInteractive: true,

    legends: [],
}

const enhance = compose(
    defaultProps(RadarDefaultProps),
    withTheme(),
    withColors({
        defaultColorBy: 'key',
    }),
    withCurve(),
    withDimensions(),
    withMotion(),
    withPropsOnChange(['indexBy'], ({ indexBy }) => ({
        getIndex: getAccessorFor(indexBy),
    })),
    withPropsOnChange(['data', 'getIndex'], ({ data, getIndex }) => ({
        indices: data.map(getIndex),
    })),
    withPropsOnChange(['keys', 'getColor'], ({ keys, getColor }) => ({
        colorByKey: keys.reduce((mapping, key, index) => {
            mapping[key] = getColor({ key, index })
            return mapping
        }, {}),
    })),
    withPropsOnChange(
        ['keys', 'indexBy', 'data', 'width', 'height'],
        ({ data, keys, width, height }) => {
            const maxValue = max(data.reduce((acc, d) => [...acc, ...keys.map(key => d[key])], []))

            const radius = Math.min(width, height) / 2
            const radiusScale = scaleLinear()
                .range([0, radius])
                .domain([0, maxValue])

            return {
                data,
                radius,
                radiusScale,
                centerX: width / 2,
                centerY: height / 2,
                angleStep: Math.PI * 2 / data.length,
            }
        }
    ),
    pure
)

const enhancedRadar = enhance(Radar)
enhancedRadar.displayName = 'enhance(Radar)'

export default enhancedRadar
