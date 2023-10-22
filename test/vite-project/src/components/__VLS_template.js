import { __VLS_publicComponent, __VLS_internalComponent, __VLS_componentsOption, __VLS_name, caricaFile, download } from "./rew.vue";

function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_publicComponent, new () => {}>> & InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & typeof __VLS_publicComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {};
({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).h1; ({} as __VLS_IntrinsicElements).h1;
({} as __VLS_IntrinsicElements).input; ({} as __VLS_IntrinsicElements).input;
({} as __VLS_IntrinsicElements).label; ({} as __VLS_IntrinsicElements).label;
({} as __VLS_IntrinsicElements).button; ({} as __VLS_IntrinsicElements).button;
{
const __VLS_0 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_2 = __VLS_1({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
{
const __VLS_4 = ({} as __VLS_IntrinsicElements)["h1"];
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, {});
({} as __VLS_IntrinsicElements).h1;
({} as __VLS_IntrinsicElements).h1;
const __VLS_6 = __VLS_5({ ...{ ...{}, }, }, ...__VLS_functionalComponentArgsRest(__VLS_5));
const __VLS_7 = __VLS_pickFunctionalComponentCtx(__VLS_4, __VLS_6)!;
(__VLS_7.slots!).default;
}
{
const __VLS_8 = ({} as __VLS_IntrinsicElements)["input"];
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, {});
({} as __VLS_IntrinsicElements).input;
const __VLS_10 = __VLS_9({ ...{ ...{}, type: ("checkbox"), name: ("cb"), id: ("checknome"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_9));
const __VLS_11 = __VLS_pickFunctionalComponentCtx(__VLS_8, __VLS_10)!;
}
{
const __VLS_12 = ({} as __VLS_IntrinsicElements)["label"];
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, {});
({} as __VLS_IntrinsicElements).label;
({} as __VLS_IntrinsicElements).label;
const __VLS_14 = __VLS_13({ ...{ ...{}, for: ("cb"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_15 = __VLS_pickFunctionalComponentCtx(__VLS_12, __VLS_14)!;
(__VLS_15.slots!).default;
}
{
const __VLS_16 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, {});
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_18 = __VLS_17({ ...{ ...{}, id: ("miofile"), }, }, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_19 = __VLS_pickFunctionalComponentCtx(__VLS_16, __VLS_18)!;
{
const __VLS_20 = ({} as __VLS_IntrinsicElements)["input"];
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, {});
({} as __VLS_IntrinsicElements).input;
const __VLS_22 = __VLS_21({ ...{ ...{ onInput: {} as any, }, type: ("file"), multiple: (true), }, }, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_23 = __VLS_pickFunctionalComponentCtx(__VLS_20, __VLS_22)!;
let __VLS_24 = { 'input': __VLS_pickEvent(__VLS_23.emit!, 'input' as const, __VLS_componentProps(__VLS_21, __VLS_22).onInput) };
__VLS_24 = {
input: (__VLS_ctx.caricaFile)
};
}
{
const __VLS_25 = ({} as __VLS_IntrinsicElements)["button"];
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, {});
({} as __VLS_IntrinsicElements).button;
({} as __VLS_IntrinsicElements).button;
const __VLS_27 = __VLS_26({ ...{ ...{ onClick: {} as any, }, }, }, ...__VLS_functionalComponentArgsRest(__VLS_26));
const __VLS_28 = __VLS_pickFunctionalComponentCtx(__VLS_25, __VLS_27)!;
let __VLS_29 = { 'click': __VLS_pickEvent(__VLS_28.emit!, 'click' as const, __VLS_componentProps(__VLS_26, __VLS_27).onClick) };
__VLS_29 = {
click: (__VLS_ctx.download)
};
(__VLS_28.slots!).default;
}
(__VLS_19.slots!).default;
}
(__VLS_3.slots!).default;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
// @ts-ignore
[caricaFile, download,];
return __VLS_slots;
}
