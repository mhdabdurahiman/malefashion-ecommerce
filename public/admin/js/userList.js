$(document).ready(function () {

    $('#user-table').on('click', '.block-unblock-btn', function () {
        var userId = $(this).data('user-id');
        var isBlocked = $(this).data('is-blocked');

        toggleUserStatus(userId, isBlocked);
    });

    function toggleUserStatus(userId, isBlocked) {
        console.log('userID:',userId)
        var url = isBlocked ? '/admin/unblockuser/' : '/admin/blockuser/'
        $.ajax({
            
            url: url+userId,
            type: 'PATCH',
            success: function () {
                $('#user-table').load('/admin/userlist #user-table')
                
            },
            error: function(error) {
                console.error('Error updating user status:', error);
            }
        });
    }

    // $('.block-unblock-btn').on('click', function () {
    //     var userId = $(this).data('user-id');
    //     var isBlocked = $(this).data('is-blocked');

    //     toggleUserStatus(userId, isBlocked);
    // });

});