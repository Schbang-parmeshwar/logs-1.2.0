// const compareLineItemToOndc = (ondcItems, lineItems, results = []) => {
//     console.log("ondcItems",ondcItems);
//     console.log("lineItems",lineItems);
//     // Base case: If either of the arrays is empty, return the results
//     if (lineItems.length === 0 || ondcItems.length === 0) {
//         // console.log("arr is : : : ", results)
//         return results;
//     }

//     // Get the last number after "/" in arr2[0].variant.id
//     const ondcItem = ondcItems[0];
//     const lineItem = lineItems[0];

//     const ondcItemId = ondcItem.id;
//     const variantId = lineItem.variant.id.split("/").pop();

//     // Check if the last number matches arr1[0].id
//     if (variantId === ondcItemId) {
//         // Create a new object with matched fields
//         const matchedObject = {
//             id: lineItem.id,
//             variantId: variantId,
//             price: lineItem.variant.price,
//             matched: true,
//             quantity: ondcItem.quantity,
//         };

//         // Check for duplicates in the results array
//         const duplicate = results.find(result => result.id === lineItem.id);

//         // If it's not a duplicate, add it to the results array
//         if (!duplicate) {
//             results.push(matchedObject);
//         }
//     }

//     // Recursively call compareLineItemToOndc with the remaining elements of both arrays
//     return compareLineItemToOndc(ondcItems.slice(1), lineItems.slice(1), results);
// };


const compareArrays = (arr1, arr2, results = []) => {
    if (arr1.length === 0 || arr2.length === 0) {
        return results;
    }

    const item1 = arr1[0];
    const item2 = arr2.find(item => item.id === item1.variant.id.split("/").pop());

    if (item2) {
        const matchedObject = {
            id: item1.id,
            variantId: item1.variant.id.split("/").pop(),
            price: item1.variant.price,
            matched: true,
            quantity: item2.quantity.count,
        };

        results.push(matchedObject);

        const remainingArr2 = arr2.filter(item => item !== item2);
        const remainingArr = arr2.filter(item =>{ console.log(item, item2)});
        // console.log("item1.id",item1.variant.id.split("/").pop())
        // console.log("arr2",arr2);
        // console.log("arr22",arr2[0]===item2);
        // console.log("remainingArr2",remainingArr2)
        // console.log("item2",item2)
        return compareArrays(arr1.slice(1), remainingArr2, results);
    } else {
        return compareArrays(arr1.slice(1), arr2, results);
    }
};

let lineItems = [
    {
        id: 'gid://shopify/LineItem/13637126291683',
        variant: {
            id: 'gid://shopify/ProductVariant/43001178849507',
            price: '335.00'
        }
    },
    {
        id: 'gid://shopify/LineItem/13637126258915',
        variant: {
            id: 'gid://shopify/ProductVariant/43001178816739',
            price: '219.00'
        }
    },



]

let ondcItems = [
    {
        id: '43001178849507',
        quantity: { count: 1 },
        ondcReturnId: '65a222662c2150ce2c6de9dd',
        reasonCode: '003'
    },
    {
        id: '43001178816739',
        quantity: { count: 1 },
        ondcReturnId: '65a222662c2150ce2c6de9db',
        reasonCode: '003'
    }
]

const result = compareArrays(lineItems, ondcItems);
console.log(result);

// problems
//if array.length>2 => incorrect response
//if sequence changes array is []


