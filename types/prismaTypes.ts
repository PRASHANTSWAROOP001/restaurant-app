import { StaffProfile } from "@prisma/client";

export type { StaffProfile, Status, Label} from "@prisma/client";

export interface StaffTableData extends StaffProfile{
    user:{
        email: string | null
    }
}

