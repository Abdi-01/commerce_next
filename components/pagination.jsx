import React, { memo } from 'react';
import { Button, ButtonGroup } from 'reactstrap'

const ButtonPagination = memo(({ page, changePage, products }) => {
    console.log("Rerender BtPagination ❌")
    const printBtPagination = () => {
        // 1-8 data => 1 button
        // 9-16 data => 2 button
        let btn = []
        // 17-24 data => 3 button
        for (let i = 0; i < Math.ceil(products.length / 8); i++) {
            btn.push(<Button outline={page == i + 1 ? false : true} color='primary' className={`rounded shadow-sm m-1`}
                disabled={page == i + 1 ? true : false}
                onClick={() => changePage(i)}>
                {i + 1}
            </Button>)
        }

        return btn;
    }
    return <ButtonGroup>
        {
            printBtPagination()
        }
    </ButtonGroup>
})

export default ButtonPagination;