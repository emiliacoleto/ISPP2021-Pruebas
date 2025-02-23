import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthServiceService } from '../../services/auth-service.service';
import { ComplaintAppealsService } from '../../services/complaint-appeals.service';
import { TripsService } from '../../services/trips.service';
import { CancelTripDialogComponent } from './cancel-trip-dialog.component';

class mockAuthService {
  public user_is_banned(): Observable<Boolean> {
    return of(true);
  }

  public set_banned() {
    return of();
  }

  public sign_out() {
    return;
  }
}

class mockTripsService {
  public cancel_driver_trip() { }
}

class mockComplaintAppealService {
  public can_complaint_appeal() {
    return of(false);
  }
}

class mockDialog {
  open() {
    return {
      afterClosed: () => of({})
    };
  }
}

describe('CancelTripDialogComponent', () => {
  let component: CancelTripDialogComponent;
  let fixture: ComponentFixture<CancelTripDialogComponent>;
  let tripsService: TripsService;
  let appealsService: ComplaintAppealsService;
  let dialog: any;

  const mockDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelTripDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, MatDialogModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: AuthServiceService, useClass: mockAuthService },
        { provide: TripsService, useClass: mockTripsService },
        { provide: ComplaintAppealsService, useClass: mockComplaintAppealService },
        { provide: MatDialog, useClass: mockDialog },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTripDialogComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
    appealsService = TestBed.inject(ComplaintAppealsService);
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#close() should close dialog', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('#continue() should cancel trip', () => {
    const spy_cancel = spyOn(tripsService, 'cancel_driver_trip');
    component.continue();
    fixture.detectChanges();
    expect(spy_cancel).toHaveBeenCalled();
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 5000,
      panelClass: ['blue-snackbar'],
    });
  });

  it('should throw error while cancel trip', () => {
    const spy = spyOn(component, 'openSnackBar');
    fixture.detectChanges();
    spyOn(tripsService, 'cancel_driver_trip').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.continue();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Ha ocurrido un error');
    });
  });
});
