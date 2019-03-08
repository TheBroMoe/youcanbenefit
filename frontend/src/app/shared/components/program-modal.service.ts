import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from "@angular/router";
import { DetailModalComponent } from './program/detail-modal/detail-modal.component';
import { Observable, of } from "rxjs";
import { map, tap, filter, take,  } from 'rxjs/operators'

@Injectable()
export class ProgramModalService {
    programs = [];
    private widthMatcher = {
        'small': {
            width: '95vw',
            height: '99vh'
        },
        'medium': {
            width: '95vw',
            height: '85vh'
        },
        'large': {
            width: '75vw',
            height: '65vh'
        }
    };

    constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {
        this.route.queryParamMap
            .pipe(
                map(paramMap => paramMap['params'] ? paramMap['params']['program'] : null),
                this.findProgram.bind(this)
            )
            .subscribe(program => {
                if (program) {
                    this.openModal(program)
                }
            })
    }

    setPrograms(input$: Observable<any[]> | any[]) {
        if (Array.isArray(input$)) {
            return this.programs = [...input$];
        }

        return input$.pipe(tap(programs => this.programs = [...programs]));
    }

    private findProgram(input$: Observable<string>): Observable<any> {
        return input$
            .pipe(
                map(title => this.programs.find(p => p.title === title )),
                filter(Boolean)
            )
    }



    private determineModalDimensions(widthInPixels: number){

        if (widthInPixels < 400) return this.widthMatcher.small;

        if (widthInPixels >= 400 && widthInPixels <= 800) return this.widthMatcher.medium;

        return this.widthMatcher.large;
    }

    private getCategory(): string {
        const routeChild = this.route.snapshot.children && this.route.snapshot.children[0] ? this.route.snapshot.children[0].params : {};
        return routeChild['category'];
    }

    openModal(program) {
        const screenDimensions: { [key: string]: string } = this.determineModalDimensions( window.innerWidth );
        const data =  {
            title: program.title,
            details: program.details,
        };

        const config: MatDialogConfig = {
            data,
            width: screenDimensions['width'],
            height: screenDimensions['height']
        };
        const ref = this.dialog.open(DetailModalComponent, config);
        const category = this.getCategory();

        of(ref.afterClosed()).pipe(take(1)).subscribe( _ => this.router.navigate([`${category}`],  {relativeTo: this.route}))
    }


}
