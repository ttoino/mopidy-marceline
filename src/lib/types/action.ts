import type { IconName } from "svelte-m3c";

export type Action = ActionGroup | BaseAction | Divider;

export type ActionGroup = {
    actions: BaseAction[];
    icon: IconName;
    label: string;
};

export type Actions = Action[];

export type BaseAction = {
    action: () => void;
    icon: IconName;
    label: string;
};

export type Divider = "divider";
