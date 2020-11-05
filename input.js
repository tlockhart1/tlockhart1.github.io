

function shapeGenForm(shape){
    $("#dropdownbtn").text(shape);
    $("#dropdownbtn").val(shape);
    $("#modalheader").text(`Define your ${shape}:`);
    $.get(`/getobject.html`, (data) => {
        $(`#inputobject`).html(data);
        if(shape == "circle")
            $(`#bottom`).append
            (
                `
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="radius" placeholder="radius" aria-label="radius" aria-describedby="basic-addon1">
                    </div>
                `
            );
        else
            $(`#bottom`).append
            (
                `
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="width" placeholder="width" aria-label="width" aria-describedby="basic-addon1">
                    </div>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" id="height" placeholder="height" aria-label="height" aria-describedby="basic-addon1">
                    </div>
                `
            );
    });
}