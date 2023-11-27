const app = Vue.createApp({
	data() {
		return {
			inns: [],
      innDetails: [],
      roomsList: [],
      searchField: '',
      reservationForm: {
        start_date: '',
        end_date: '',
        guests: '',
        room_id: null
      }
		};
	},
 
  methods: {
    async searchApi() {
      try {
        let response = await fetch(`http://localhost:3000/api/v1/inns?search=${this.searchField}`);
        let data = await response.json();
        this.inns = data;
      } catch(error) {
          console.error('Erro na busca de pousadas', error);
      }
    },
    async getDetails(id) {
      try {
        let response = await fetch(`http://localhost:3000/api/v1/inns/${id}`);
        let innDetails = await response.json();
        let roomsList = await this.getRooms(id);
        this.innDetails = innDetails;
        this.roomsList = roomsList;
      } catch(error) {
          console.error('Erro na busca de detalhes', error);
      }
    },
    async getRooms(id) {
      try {
        let response = await fetch(`http://localhost:3000/api/v1/inns/${id}/rooms`);
        let roomsList = await response.json();
        return roomsList
      } catch(error) {
        console.error('Erro na busca de quartos da pousada', error);
      }
    },
    async makeReservation(room_id) {
      this.reservationForm.room_id = room_id;
      try {
        let response = await fetch(`http://localhost:3000/api/v1/rooms/${room_id}/reservation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.reservationForm)
          });
        if (response.status === 201) {
          alert('Reserva feita com sucesso.');
        }
        else if (response.status === 202) {
          alert('Este quarto não está disponível nesse período.')
        }
        else if (response.status === 422) {
          console.log('else if 422')
          const errorData = await response.json();
          let validationError = errorData.errors;
          alert('Ops: ' + validationError.join(', '));
        }
      } catch (error) {
        console.log('Catch!');
        console.error('Falha na tentativa de reserva', error);
        alert('Erro na tentativa de fazer reserva. Tente novamente mais tarde.')
      }
    },

    dateShow(checkdate) {
      const date = new Date(checkdate);
      return date.toLocaleString('pt-BR', { 
        /*weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',*/
        hour: '2-digit', minute: '2-digit' 
      });
    },
  },

  

  async mounted() {
    try {
      let response = await fetch(`http://localhost:3000/api/v1/inns/`);
      let data = await response.json();
      this.inns = data;
    } catch (err) {
      console.error('Erro na listagem de pousadas', err);
    }
  }
})

app.mount('#app');
