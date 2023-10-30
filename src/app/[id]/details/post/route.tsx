import supabase from "@/app/utils/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const revalidate = 0;
var i

export async function POST(request: Request) {
    const requestUrl = new URL(request.url)
    const formData = await request.json()
    const cookieStore = cookies()
    const supabaseAuth = createRouteHandlerClient({ cookies: () => cookieStore })

    const orgID = formData.orgID
    const userID = formData.donorID

    const { data: { session }, error: session_error } = await supabaseAuth.auth.getSession()
    const uid = session?.user.id
    console.log("USER ID IS: " + uid)

    //GETS THE DATA INSERTED INTO ADDRESS FORM
    const address = {
        house_number: formData.house_no,
        street_name: formData.street,
        village_name: formData.village,
        barangay: formData.brgy,
        zipcode: formData.zip_code,
        city: formData.city,
        province: formData.province
    }

    //STORES THE DONATED ITEMS INTO ARRAY FOR CLEANLINESS
    var item = formData.items

    //INSERTS ADDRESS DETAILS INTO ADDRESS TABLE AND GETS THE ID OF NEW RECORD
    const { data: new_address, error: address_error } = await supabase.from('address').insert(address).select();
    const address_id = new_address![0].id
    console.log("ADDRESS ID IS: " + address_id)
    console.log("INSERT ERROR IS: " + address_error)

    const transaction = {
        charity_id: orgID,
        verify: false,
        donor_id: uid,

        donor_address_id: address_id
    };

    const { data: new_item, error } = await supabase.from('items_donation_transaction').insert(transaction).select();
    const item_id = new_item![0].id
    console.log("ITEM ID IS: " + item_id)
    console.log("INSERT ERROR (2) IS: ", error)

    //ITERATES THROUGH THE ITEM ARRAY (Line 32), CONVERTS THE VALUE OF ISPERISHABLE SELECTFIELD INTO BOOL (Line 33) 
    for (i = 0; i < item.length; i++) {
        item[i].perishable = Boolean(item[i].perishable)
        //ASSIGNS NEW ADDRESS ID TO ALL THE ITEMS SPECIFIED INTO FORM
        Object.assign(item[i], { donation_id: item_id })
    }

    //INSERTS DATA OF ITEMS ARRAY INTO RESPECTIVE TABLE
    const { data: item_data, error: item_error } = await supabase.from('inventory_item').insert(item).select()
    console.log("INSERT ERROR (3) IS: ", item_error)

    console.log("DONATION SUCCESS!")

    return Response.redirect(`${requestUrl.origin}/thankyou`)

}