import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CancelTripDialogComponent } from '../../../components/cancel-trip-dialog/cancel-trip-dialog.component';
import { TripsService } from '../../../services/trips.service';

@Component({
  selector: 'frontend-driver-trip-list-page',
  templateUrl: './driver-trip-list-page.component.html',
  styleUrls: ['./driver-trip-list-page.component.scss'],
})
export class DriverTripListPageComponent {
  trips = [];

  constructor(
    private _trips_service: TripsService,
    private _snackbar: MatSnackBar,
    private dialog: MatDialog,
    private _router: Router
  ) {
    this.load_trips_by_driver();
  }

  async load_trips_by_driver() {
    try {
      this.trips = await this._trips_service.get_driver_trips();
    } catch (error) {
      this._snackbar.open("Se ha producido un error al cargar los viajes", null, {
        duration: 3000,
      });
    }
  }

  can_cancel(start_date: string) {
    return new Date(start_date) > new Date();
  }

  go_to_trip(trip_id) {
    this._router.navigate(['/', 'authenticated', 'driver-trips', trip_id]);
  }

  async cancel(trip_id, cancelationDateLimit: string) {
    try {
      if (new Date(cancelationDateLimit) < new Date()) {
        this.dialog.open(CancelTripDialogComponent, {
          data: trip_id,
          disableClose: true,
        });
      } else {
        await this._trips_service.cancel_driver_trip(trip_id);
        this._snackbar.open('Viaje cancelado correctamente', null, {
          duration: 3000,
        });
      }
      await this.load_trips_by_driver();
    } catch (error) {
      this._snackbar.open("Se ha producido un error al cancelar el viaje", null, {
        duration: 2000,
      });
    }
  }
}
