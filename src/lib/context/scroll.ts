import { getContext, setContext } from "svelte";

export const SCROLL = "scroll";

export const setScroll = (scroll: () => HTMLElement | null) =>
    setContext(SCROLL, scroll);

export const getScroll = () => {
    const scroll = getContext<() => HTMLElement | null>(SCROLL);

    if (!scroll) throw new Error("Scroll context not found");

    return scroll;
};
