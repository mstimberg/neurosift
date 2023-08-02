import { FunctionComponent, useEffect, useMemo, useState } from "react"

type PSTHWidgetProps = {
    width: number
    height: number
    trials: {times: number[], group: any}[]
    groups: {group: any, color: string}[]
    windowRange: {start: number, end: number}
    alignmentVariableName: string
}

const PSTHHistWidget: FunctionComponent<PSTHWidgetProps> = ({width, height, trials, groups, windowRange, alignmentVariableName}) => {
    const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null)

    const margins = useMemo(() => ({left: 50, right: 20, top: 40, bottom: 40}), [])

    const groupPlots = useMemo(() => {
        const numBins = 30
        const t1 = windowRange.start
        const t2 = windowRange.end
        const binSize = (t2 - t1) / numBins
        const binEdges = new Array(numBins + 1).fill(0).map((_, ii) => t1 + ii * binSize)
        const ret: {group: {group: any, color: string}, firingRates: number[]}[] = []
        groups.forEach(g => {
            const trials2 = trials.filter(t => (t.group === g.group))
            if (trials2.length === 0) return
            const timesForGroup = trials2.map(t => t.times).flat()
            const binCounts: number[] = []
            for (let i = 0; i < numBins; i++) {
                const t1 = binEdges[i]
                const t2 = binEdges[i + 1]
                const count = timesForGroup.filter(t => (t >= t1) && (t < t2)).length
                binCounts.push(count)
            }
            ret.push({
                group: g,
                firingRates: binCounts.map(c => c / trials2.length / binSize)
            })
        })
        return ret
    }, [trials, groups, windowRange])

    const maxFiringRate = useMemo(() => {
        let ret = 0
        groupPlots.forEach(g => {
            g.firingRates.forEach(r => {
                if (r > ret) ret = r
            })
        })
        return ret
    }, [groupPlots])

    const coordToPixel = useMemo(() => ((t: number, firingRate: number) => {
        const x = margins.left + (t - windowRange.start) / (windowRange.end - windowRange.start) * (width - margins.left - margins.right)
        const y = height - margins.bottom - firingRate / maxFiringRate * (height - margins.top - margins.bottom)
        return {x, y}
    }), [windowRange, width, height, maxFiringRate, margins])

    useEffect(() => {
        if (!canvasElement) return
        const ctx = canvasElement.getContext('2d')
        if (!ctx) return

        ctx.clearRect(0, 0, width, height)

        // vertical line at zero
        ctx.strokeStyle = 'lightgray'
        ctx.lineWidth = 3
        ctx.beginPath()
        const p1 = coordToPixel(0, 0)
        const p2 = coordToPixel(0, trials.length)
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()

        ctx.font = '12px sans-serif'

        // y axis
        ctx.strokeStyle = 'gray'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(margins.left, margins.top)
        ctx.lineTo(margins.left, height - margins.bottom)
        ctx.stroke()

        // y axis label
        const yAxisLabel = 'Firing rate (Hz)'
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.save()
        const x0 = margins.left - 6
        const y0 = margins.top + (height - margins.top - margins.bottom) / 2
        ctx.translate(x0, y0)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(yAxisLabel, 0, 0)
        ctx.restore()

        // x axis labels
        ctx.fillStyle = 'black'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillText('0', p1.x, p1.y + 4)
        ctx.fillText(windowRange.start.toString(), margins.left, height - margins.bottom + 4)
        ctx.fillText(windowRange.end.toString(), width - margins.right, height - margins.bottom + 4)
        const labelText = 'Time offset (s)'
        ctx.fillText(labelText, margins.left + (width - margins.left - margins.right) / 2, height - margins.bottom + 20)

        // x axis
        ctx.strokeStyle = 'gray'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(margins.left, height - margins.bottom)
        ctx.lineTo(width - margins.right, height - margins.bottom)
        ctx.stroke()

        // plots
        groupPlots.forEach(g => {
            ctx.strokeStyle = g.group.color
            ctx.lineWidth = 2
            ctx.beginPath()
            const p0 = coordToPixel(windowRange.start, g.firingRates[0])
            ctx.moveTo(p0.x, p0.y)
            g.firingRates.forEach((r, i) => {
                const t1 = windowRange.start + i * (windowRange.end - windowRange.start) / g.firingRates.length
                const t2 = windowRange.start + (i + 1) * (windowRange.end - windowRange.start) / g.firingRates.length
                const p1 = coordToPixel(t1, r)
                const p2 = coordToPixel(t2, r)
                ctx.lineTo(p1.x, p1.y)
                ctx.lineTo(p2.x, p2.y)
            })
            ctx.stroke()
        })
    }, [canvasElement, width, height, trials, groups, windowRange, alignmentVariableName, groupPlots, coordToPixel, margins])

    return (
        <canvas
            ref={elmt => setCanvasElement(elmt)}
            width={width}
            height={height}
        />
    )
}

export default PSTHHistWidget