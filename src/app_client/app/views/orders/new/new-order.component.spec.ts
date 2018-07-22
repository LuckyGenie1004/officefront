import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DBService } from '../../../services/db.service';
import { OrderBuilderService } from '../../../services/order-builder.service';
import { OrderService } from '../../../services/order.service';
import { PatientService } from '../../../services/patient.service';
import { mock } from '../../../utils/mock';
import { NewOrderComponent } from './new-order.component';
import { OrderNotSubmittedComponent } from './ordernotsubmitted.component';
class MockRouter {
    navigateByUrl(url: String) { return url }
}
describe('NewOrderComponent', () => {
    const mockOrderService = mock(OrderService.prototype);
    const mockDbService = mock(DBService.prototype);
    let mockRouter;
    let httpMock;
    const mockOrderSubmittedComponent = mock(OrderNotSubmittedComponent);
    const mockOrderBuilderService = mock(OrderBuilderService.prototype);
    let fixture: ComponentFixture<NewOrderComponent>;
    let newOrderComponent: NewOrderComponent;
    beforeEach(() => {
        mockRouter = new MockRouter();
        mockOrderService.submitOrder = () => void 0;
        spyOn(mockOrderService, 'submitOrder').and.returnValue(Promise.resolve())
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                HttpClientTestingModule
            ],
            providers: [
                { provide: OrderBuilderService, useValue: mockOrderBuilderService },
                { provide: OrderService, useValue: mockOrderService },
                { provide: PatientService, useClass: PatientService },
                { provide: DBService, useValue: mockDbService },
                { provide: Router, useValue: mockRouter }
            ],
            declarations: [
                NewOrderComponent
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        })
        httpMock = TestBed.get(HttpTestingController);
        fixture = TestBed.createComponent(NewOrderComponent);
        newOrderComponent = fixture.componentInstance;
    });

    it('should get patients from patientService on load', () => {
        expect(httpMock.expectOne('./some-place'));
    });

    it('should submit orders on submit', () => {
        newOrderComponent.patientProfile = {
            dateOfBirth: '07/30/1993',
            firstName: 'Kunle',
            lastName: 'Oshi'
        }
        newOrderComponent.submitOrder();

        expect(newOrderComponent.orderService.submitOrder).toHaveBeenCalled();
        expect(newOrderComponent.orderService.submitOrder).toHaveBeenCalledWith({
            dateOfBirth: '07/30/1993',
            firstName: 'Kunle',
            lastName: 'Oshi'
        });
    });
    it('should call getOrders on app init', () => {
        newOrderComponent.ngOnInit();
        expect(newOrderComponent.orderService.getOrders).toHaveBeenCalled();
    });
    it('should unsubscribe from patientSubscription on destroy', () => {
        spyOn(newOrderComponent.patientsSubscription, 'unsubscribe');
        newOrderComponent.ngOnDestroy();
        expect(newOrderComponent.patientsSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should autocomplete with given data', () => {
        const testData = {
            firstName: 'Kunle',
            lastName: 'Oshi',
            dateOfBirth: '07/30/1992'
        };
        newOrderComponent.firstNameAutoCompleted(testData);
        expect(newOrderComponent.patientProfile).toEqual(testData);
    });

    it('should render correct autocomplete html', () => {
        newOrderComponent.autocompleListFormatter({
            firstName: 'Kunle',
            lastName: 'Oshi',
            dateOfBirth: '07/30/1993'
        });
    });

    it('should toggle time mode to meridian and back', () => {
        newOrderComponent.isMeridian = false;
        newOrderComponent.toggleMode();
        expect(newOrderComponent.isMeridian).toBeTruthy();
        newOrderComponent.isMeridian = true;
        newOrderComponent.toggleMode();
        expect(newOrderComponent.isMeridian).toBeFalsy();
    });

    afterEach(() => {
        const element = fixture.debugElement.nativeElement;
        element.remove();
    });
});
