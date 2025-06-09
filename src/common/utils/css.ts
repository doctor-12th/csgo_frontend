export function getCssVar(varName: string,element?: HTMLElement) {
    if (!varName?.startsWith("--")) {
        console.warn("varName 必须以 -- 开头");
        return "";
    }
    return getComputedStyle(element ?? document.documentElement).getPropertyValue(varName);
}

export function setCssVar(varName: string, value: string,element?: HTMLElement) {
    if (!varName?.startsWith("--")) {
        console.warn("varName 必须以 -- 开头");
        return "";
    }
    return document.documentElement.style.setProperty(varName, value);
}