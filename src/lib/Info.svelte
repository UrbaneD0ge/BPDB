<script module>
    let infoPopoverCount = 0;
</script>

<script>
    let {
        message = '',
        buttonText = '?',
        label = 'More information',
        targetId
    } = $props();

    const instanceId = ++infoPopoverCount;
    const generatedTarget = `info-popover-${instanceId}`;
    const generatedAnchor = `--info-button-anchor-${instanceId}`;
    let target = $derived(targetId ?? generatedTarget);
</script>

<button
    type="button"
    class="info-button"
    style={`anchor-name: ${generatedAnchor};`}
    aria-label={label}
    title={label}
    popovertarget={target}
>
    {buttonText}
</button>

<div id={target} popover class="info-popover" style={`position-anchor: ${generatedAnchor};`}>{message}</div>

<style>
    @position-try --info-below {
        top: anchor(bottom);
        left: anchor(center);
        transform: translate(-50%, 0.5rem);
    }

    @position-try --info-above-left {
        top: anchor(top);
        left: anchor(left);
        transform: translate(0, calc(-100% - 0.5rem));
    }

    @position-try --info-above-right {
        top: anchor(top);
        left: anchor(right);
        transform: translate(-100%, calc(-100% - 0.5rem));
    }

    @position-try --info-below-left {
        top: anchor(bottom);
        left: anchor(left);
        transform: translate(0, 0.5rem);
    }

    @position-try --info-below-right {
        top: anchor(bottom);
        left: anchor(right);
        transform: translate(-100%, 0.5rem);
    }

    @position-try --info-right {
        top: anchor(top);
        left: anchor(right);
        transform: translate(2rem, 0);
    }

    @position-try --info-left {
        top: anchor(top);
        left: anchor(left);
        transform: translate(calc(-100% - 1rem), 0);
    }

    .info-button {
        width: 1.2rem;
        height: 1.2rem;
        background-color: #7f8080a7;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
        line-height: 1.2rem;
        border-radius: 50%;
        cursor: pointer;
        z-index: 10;
    }

    .info-button:hover {
        background-color: #4a5565;
    }

    .info-popover {
        max-width: min(18rem, calc(100vw - 1rem));
        max-height: calc(100vh - 1rem);
        margin: 20px;
        padding: 0.5rem 0.75rem;
        border: 1px solid #4a5565;
        border-radius: 0.5rem;
        background-color: #1f2937;
        color: white;
        box-sizing: border-box;
        overflow: auto;
        overflow-wrap: anywhere;

        position: fixed;
        top: anchor(top);
        left: anchor(center);
        transform: translate(-50%, calc(-100% - 0.5rem));
        position-try-fallbacks: --info-below, --info-above-left, --info-above-right, --info-below-left, --info-below-right, --info-right, --info-left;
    }

    /* style the backdrop */
    /* .info-popover::backdrop {
        background-color: rgba(0, 0, 0, 0.5);
    } */
</style>