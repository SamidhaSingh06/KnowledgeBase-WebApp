$(document).ready(function(){
    $('.delete').click(function(e){
        $target = $(e.target);
        const id = $target.attr('id');

        $.ajax({
            type: 'DELETE',
            url: '/articles/'+ id,
            success: (res) => {
                alert('Deleting Article');
            },
            error: (err) => {
                console.log(err);
            }
        });
    });
});