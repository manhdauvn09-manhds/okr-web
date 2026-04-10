import { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { User } from '../types';

interface Props {
  currentUserId: number;
  onAssign: (memberId: number, targetManagerId: number) => Promise<void>;
  onPromote: (memberId: number) => Promise<void>;
  teamMembers: User[];
  managers: User[];
}

export function DelegationPage({ currentUserId, onAssign, onPromote, teamMembers, managers }: Props) {
  const { t } = useI18n();
  const [assignTargets, setAssignTargets] = useState<Record<number, number>>({});

  useEffect(() => {
    const defaults: Record<number, number> = {};
    const otherManagers = managers.filter((m) => m.id !== currentUserId);
    if (otherManagers.length > 0) {
      teamMembers.forEach((m) => {
        defaults[m.id] = otherManagers[0].id;
      });
    }
    setAssignTargets(defaults);
  }, [teamMembers, managers, currentUserId]);

  const otherManagers = managers.filter((m) => m.id !== currentUserId);

  return (
    <div className="page-container">
      <h1 className="page-title">{t('deleg.title')}</h1>

      <div className="card">
        <h2 className="section-title">{t('deleg.yourTeam')} ({teamMembers.length})</h2>

        {teamMembers.length === 0 ? (
          <p className="meta-line">{t('deleg.noMembers')}</p>
        ) : (
          <div className="delegation-table-wrap">
            <table className="delegation-table">
              <thead>
                <tr>
                  <th>{t('deleg.name')}</th>
                  <th>{t('deleg.email')}</th>
                  <th>{t('deleg.role')}</th>
                  <th>{t('deleg.assignTo')}</th>
                  <th>{t('deleg.action')}</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="deleg-name">{member.name}</td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`role-pill ${member.role === 'MANAGER' ? 'role-manager' : 'role-employee'}`}>
                        {member.role}
                      </span>
                    </td>
                    <td>
                      {otherManagers.length > 0 ? (
                        <select
                          className="field-select deleg-select"
                          value={assignTargets[member.id] ?? ''}
                          onChange={(e) =>
                            setAssignTargets((prev) => ({ ...prev, [member.id]: Number(e.target.value) }))
                          }
                        >
                          {otherManagers.map((mgr) => (
                            <option key={mgr.id} value={mgr.id}>
                              {mgr.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="meta-line">—</span>
                      )}
                    </td>
                    <td>
                      <div className="deleg-actions">
                        {otherManagers.length > 0 && (
                          <button
                            className="btn-sm btn-primary"
                            onClick={() => onAssign(member.id, assignTargets[member.id])}
                          >
                            {t('deleg.assign')}
                          </button>
                        )}
                        <button
                          className="btn-sm secondary"
                          onClick={() => {
                            if (window.confirm(`${t('deleg.confirmPromote')} ${member.name} ${t('deleg.confirmPromote2')}`)) {
                              onPromote(member.id);
                            }
                          }}
                        >
                          {t('deleg.promote')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
