(function () {
    'use strict';
    const apiKey = 'wkTCte0wZdOfJdM2OJNJJj09h0tb1DEeccrjTAog';
    const baseURL = `https://developer.nps.gov/api/v1`;
    $("form").on('submit', function (e) {
        e.preventDefault();
        $('.loading').removeClass('hide');
        $('#err').addClass('hide');
        const state = $('#state').val();
        if (!state) {
            return errCreator('You must have a state!');
        }
        const result = $('#maxresult').val();
        const stateTransformed = createStates(state);
        fetch(`${baseURL}/parks?${stateTransformed}&api_key=${apiKey}&limit=${result}`)
            .then(resp => {
               
                if (resp.ok) {
                    return resp.json();
                }
                throw new Error(resp.status);
            })
            .then(resp => {
                
                const { data } = resp;
                const html = data.reduce((acc, curr) => {
                   
                    return acc += `
                    <div class="card mt-2">
                        <div class="card-body">
                            <p><b>Full Name: </b>${curr.fullName}</p>
                            <p><b>Description: </b>${curr.description}</p>
                            <p><b>Url: </b><a href='${curr.url}' target='_blank'  >${curr.url}</a></p>
                        </div>
                    </div>
                    `
                }, '');
                $('#results').html(html);
            })
            .catch(err => {
                errCreator(err.message);
            })
            .finally(() => {
                $('.loading').addClass('hide');
            })
    });

    function errCreator(message) {
        $('#err').removeClass('hide').html(`Error: [${message}] occurred!`);
    }

    function createStates (state) {
        
        const states = state.split(',');
        return states.map((s, idx) => {
            if (idx === 0) {
                return `stateCode=${s}`;
            }
            return `&stateCode=${s}`;
        })
    }

})()

